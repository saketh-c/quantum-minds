import pennylane as qml
from pennylane import numpy as np
import numpy as _np            # stdlib numpy (for RandomState etc.)
import pandas as pd
import os
import json
import time
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, classification_report,
    roc_auc_score, roc_curve,
    precision_recall_curve, average_precision_score,
    matthews_corrcoef, cohen_kappa_score,
    log_loss, balanced_accuracy_score
)
from sklearn.model_selection import train_test_split

# CONFIGURATION (must match training)
QUBITS = 14
LAYERS = int(os.environ.get("QM_LAYERS", "5"))
SPLIT_SEED = 42
EVAL_TRAIN_SUBSET = int(os.environ.get("QM_EVAL_TRAIN_SUBSET", "2000"))  # 0 => full train set

def load_model_and_data():
    """Load trained weights and test data"""
    weights_paths = [
        'quantum_weights.npy',
        'backend/quantum_weights.npy',
        'backend/backend/quantum_weights.npy'
    ]
    weights = None
    for path in weights_paths:
        if os.path.exists(path):
            print(f"  Loading weights from: {path}")
            weights = np.load(path)
            break

    if weights is None:
        raise FileNotFoundError("No weights file found. Train model first with train_vqc.py")

    data_paths = ['backend/synthetic_clinical_data.csv', 'synthetic_clinical_data.csv']
    df = None
    for path in data_paths:
        if os.path.exists(path):
            print(f"  Loading data from: {path}")
            df = pd.read_csv(path)
            break

    if df is None:
        raise FileNotFoundError("Data file not found.")

    X = df.iloc[:, 0:14].values
    Y = df['Risk_Label'].values

    # Prefer the exact split used during training (prevents mismatch).
    split_path = 'backend/data_split.json'
    if os.path.exists(split_path):
        with open(split_path, 'r') as f:
            split = json.load(f)
        train_idx = np.array(split['train_idx'], dtype=int)
        test_idx = np.array(split['test_idx'], dtype=int)
        X_train, X_test = X[train_idx], X[test_idx]
        Y_train, Y_test = Y[train_idx], Y[test_idx]
        split_meta = {"type": "saved_indices", "path": split_path, "seed": split.get("split_seed")}
    else:
        idx = np.arange(len(X))
        train_idx, test_idx = train_test_split(
            idx,
            test_size=0.2,
            random_state=SPLIT_SEED,
            shuffle=True,
            stratify=(Y if len(np.unique(Y)) > 1 else None),
        )
        X_train, X_test = X[train_idx], X[test_idx]
        Y_train, Y_test = Y[train_idx], Y[test_idx]
        split_meta = {"type": "train_test_split", "seed": SPLIT_SEED}

    return weights, X_train, Y_train, X_test, Y_test, df.columns[:14].tolist(), split_meta, df


def run_predictions(weights, X_test, Y_test):
    """Run quantum circuit on all test samples"""
    dev = qml.device("default.qubit", wires=QUBITS)

    @qml.qnode(dev)
    def circuit(weights, x):
        qml.AngleEmbedding(features=x * np.pi, wires=range(QUBITS), rotation='Y')
        qml.StronglyEntanglingLayers(weights, wires=range(QUBITS))
        return qml.expval(qml.PauliZ(0))

    predictions = []
    probabilities = []
    total = len(X_test)

    for i, x in enumerate(X_test):
        exp_val = circuit(weights, x)
        prob = float((exp_val + 1) / 2)
        probabilities.append(prob)
        predictions.append(1 if prob >= 0.45 else 0)

        if (i + 1) % 100 == 0 or (i + 1) == total:
            pct = (i + 1) / total * 100
            print(f"  [{pct:5.1f}%] Processed {i + 1}/{total} samples...")

    return np.array(predictions), np.array(probabilities)


def compute_core_metrics(Y_test, predictions, probabilities):
    """Compute all classification metrics"""
    accuracy = float(accuracy_score(Y_test, predictions))
    precision = float(precision_score(Y_test, predictions, zero_division=0))
    recall = float(recall_score(Y_test, predictions, zero_division=0))
    f1 = float(f1_score(Y_test, predictions, zero_division=0))
    balanced_acc = float(balanced_accuracy_score(Y_test, predictions))
    mcc = float(matthews_corrcoef(Y_test, predictions))
    kappa = float(cohen_kappa_score(Y_test, predictions))

    # AUC-ROC
    try:
        auc_roc = float(roc_auc_score(Y_test, probabilities))
    except ValueError:
        auc_roc = 0.0

    # AUC-PR
    try:
        auc_pr = float(average_precision_score(Y_test, probabilities))
    except ValueError:
        auc_pr = 0.0

    # Log Loss
    probs_clipped = np.clip(probabilities, 1e-7, 1 - 1e-7)
    try:
        logloss = float(log_loss(Y_test, probs_clipped))
    except ValueError:
        logloss = 0.0

    # Confusion matrix
    cm = confusion_matrix(Y_test, predictions)
    tn, fp, fn, tp = cm.ravel()
    specificity = float(tn / (tn + fp)) if (tn + fp) > 0 else 0.0
    sensitivity = recall
    ppv = float(tp / (tp + fp)) if (tp + fp) > 0 else 0.0  # Positive predictive value
    npv = float(tn / (tn + fn)) if (tn + fn) > 0 else 0.0  # Negative predictive value
    fpr = float(fp / (fp + tn)) if (fp + tn) > 0 else 0.0  # False positive rate
    fnr = float(fn / (fn + tp)) if (fn + tp) > 0 else 0.0  # False negative rate

    return {
        "accuracy": accuracy,
        "precision": precision,
        "recall": recall,
        "f1_score": f1,
        "balanced_accuracy": balanced_acc,
        "mcc": mcc,
        "cohen_kappa": kappa,
        "auc_roc": auc_roc,
        "auc_pr": auc_pr,
        "log_loss": logloss,
        "specificity": specificity,
        "sensitivity": sensitivity,
        "ppv": ppv,
        "npv": npv,
        "fpr": fpr,
        "fnr": fnr,
        "confusion_matrix": {
            "tn": int(tn), "fp": int(fp),
            "fn": int(fn), "tp": int(tp)
        }
    }


def safe_float(x):
    """Convert to JSON-safe float (replace inf/nan)"""
    v = float(x)
    if v != v:  # NaN
        return 0.0
    if v == float('inf'):
        return 1.0
    if v == float('-inf'):
        return 0.0
    return v

def compute_roc_curve(Y_test, probabilities):
    """Compute ROC curve data points"""
    try:
        fpr, tpr, thresholds = roc_curve(Y_test, probabilities)
        # Downsample to max 200 points for JSON
        step = max(1, len(fpr) // 200)
        return {
            "fpr": [safe_float(x) for x in fpr[::step]],
            "tpr": [safe_float(x) for x in tpr[::step]],
            "thresholds": [safe_float(x) for x in thresholds[::step]]
        }
    except Exception:
        return {"fpr": [0, 1], "tpr": [0, 1], "thresholds": [1, 0]}


def compute_pr_curve(Y_test, probabilities):
    """Compute Precision-Recall curve data points"""
    try:
        prec, rec, thresholds = precision_recall_curve(Y_test, probabilities)
        step = max(1, len(prec) // 200)
        return {
            "precision": [safe_float(x) for x in prec[::step]],
            "recall": [safe_float(x) for x in rec[::step]],
            "thresholds": [safe_float(x) for x in thresholds[::step]]
        }
    except Exception:
        return {"precision": [1, 0], "recall": [0, 1], "thresholds": [1, 0]}


def compute_threshold_analysis(Y_test, probabilities):
    """Compute metrics at various thresholds"""
    thresholds = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]
    analysis = []
    for t in thresholds:
        preds = (probabilities >= t).astype(int)
        analysis.append({
            "threshold": t,
            "accuracy": float(accuracy_score(Y_test, preds)),
            "precision": float(precision_score(Y_test, preds, zero_division=0)),
            "recall": float(recall_score(Y_test, preds, zero_division=0)),
            "f1": float(f1_score(Y_test, preds, zero_division=0)),
            "predicted_positive": int(np.sum(preds)),
            "predicted_negative": int(len(preds) - np.sum(preds))
        })
    return analysis


def compute_feature_importance(weights, X_test, Y_test, probabilities, baseline_acc):
    """Compute permutation-based feature importance"""
    dev = qml.device("default.qubit", wires=QUBITS)

    @qml.qnode(dev)
    def circuit(weights, x):
        qml.AngleEmbedding(features=x * np.pi, wires=range(QUBITS), rotation='Y')
        qml.StronglyEntanglingLayers(weights, wires=range(QUBITS))
        return qml.expval(qml.PauliZ(0))

    feature_names = [
        "Connectivity", "Memory", "Sleep", "Developmental",
        "Anxiety", "Isolation", "Substance", "Diet",
        "Academic", "Family", "Bullying", "Safety",
        "Monitoring", "Exercise"
    ]

    # Use a smaller subset for speed
    subset_size = min(200, len(X_test))
    indices = _np.random.choice(len(X_test), subset_size, replace=False)
    X_sub = X_test[indices]
    Y_sub = Y_test[indices]

    # Baseline accuracy on subset
    base_preds = []
    for x in X_sub:
        exp_val = circuit(weights, x)
        prob = float((exp_val + 1) / 2)
        base_preds.append(1 if prob >= 0.45 else 0)
    base_acc = float(accuracy_score(Y_sub, base_preds))

    importances = []
    for feat_idx in range(QUBITS):
        X_permuted = X_sub.copy()
        _np.random.shuffle(X_permuted[:, feat_idx])

        perm_preds = []
        for x in X_permuted:
            exp_val = circuit(weights, x)
            prob = float((exp_val + 1) / 2)
            perm_preds.append(1 if prob >= 0.45 else 0)

        perm_acc = float(accuracy_score(Y_sub, perm_preds))
        drop = base_acc - perm_acc

        importances.append({
            "feature_index": feat_idx,
            "feature_name": feature_names[feat_idx],
            "importance": float(max(0, drop)),
            "accuracy_drop": float(drop),
            "permuted_accuracy": perm_acc
        })
        print(f"  Feature {feat_idx:2d} ({feature_names[feat_idx]:15s}): drop = {drop:+.4f}")

    # Sort by importance descending
    importances.sort(key=lambda x: x["importance"], reverse=True)
    return importances


def compute_probability_distribution(probabilities):
    """Compute probability distribution statistics"""
    # Histogram bins
    hist_counts, bin_edges = np.histogram(probabilities, bins=20, range=(0, 1))
    histogram = []
    for i in range(len(hist_counts)):
        histogram.append({
            "bin_start": float(bin_edges[i]),
            "bin_end": float(bin_edges[i + 1]),
            "count": int(hist_counts[i])
        })

    risk_tiers = {
        "Low": int(np.sum(probabilities < 0.4)),
        "Moderate": int(np.sum((probabilities >= 0.4) & (probabilities < 0.7))),
        "High": int(np.sum((probabilities >= 0.7) & (probabilities < 0.85))),
        "Crisis": int(np.sum(probabilities >= 0.85))
    }

    return {
        "mean": float(np.mean(probabilities)),
        "std": float(np.std(probabilities)),
        "min": float(np.min(probabilities)),
        "max": float(np.max(probabilities)),
        "median": float(np.median(probabilities)),
        "q25": float(np.percentile(probabilities, 25)),
        "q75": float(np.percentile(probabilities, 75)),
        "histogram": histogram,
        "risk_tiers": risk_tiers
    }


def load_training_history():
    """Load training history if available"""
    history_paths = [
        'backend/training_history.json',
        'training_history.json',
        'backend/backend/training_history.json'
    ]
    for path in history_paths:
        if os.path.exists(path):
            with open(path, 'r') as f:
                return json.load(f)
    return None


def evaluate_model():
    """Run comprehensive model evaluation"""
    print("=" * 60)
    print("  QUANTUM MIND - VQC MODEL EVALUATION")
    print("=" * 60)
    start_time = time.time()

    # 1. Load data
    print("\n[1/7] Loading model and data...")
    weights, X_train, Y_train, X_test, Y_test, feature_cols, split_meta, df = load_model_and_data()
    print(f"  Train set: {len(X_train)} samples")
    print(f"  Test set:  {len(X_test)} samples")
    print(f"  Positive:  {int(np.sum(Y_test))} | Negative: {int(len(Y_test) - np.sum(Y_test))}")
    print(f"  Split:     {split_meta}")
    print(f"  Test pos rate: {(float(np.mean(Y_test)) * 100):.1f}%")

    # 2. Run predictions (test)
    print("\n[2/7] Running quantum predictions (test set)...")
    predictions, probabilities = run_predictions(weights, X_test, Y_test)

    # Run predictions (train) for overfitting check
    if EVAL_TRAIN_SUBSET == 0 or EVAL_TRAIN_SUBSET >= len(X_train):
        X_train_eval = X_train
        Y_train_eval = Y_train
        subset_note = f"full train set ({len(X_train_eval)})"
    else:
        # deterministic subset for repeatability
        rng = _np.random.RandomState(SPLIT_SEED)
        idx = rng.choice(len(X_train), size=EVAL_TRAIN_SUBSET, replace=False)
        X_train_eval = X_train[idx]
        Y_train_eval = Y_train[idx]
        subset_note = f"subset ({len(X_train_eval)}/{len(X_train)})"

    print(f"\n      Running quantum predictions (train set for overfitting check) on {subset_note}...")
    train_preds, train_probs = run_predictions(weights, X_train_eval, Y_train_eval)

    # 3. Core metrics
    print("\n[3/7] Computing core metrics...")
    metrics = compute_core_metrics(Y_test, predictions, probabilities)
    train_metrics = compute_core_metrics(Y_train_eval, train_preds, train_probs)

    # 4. Curves
    print("\n[4/7] Computing ROC and PR curves...")
    roc_data = compute_roc_curve(Y_test, probabilities)
    pr_data = compute_pr_curve(Y_test, probabilities)

    # 5. Threshold analysis
    print("\n[5/7] Computing threshold analysis...")
    threshold_analysis = compute_threshold_analysis(Y_test, probabilities)

    # 6. Feature importance
    print("\n[6/7] Computing feature importance (permutation-based)...")
    feature_importance = compute_feature_importance(
        weights, X_test, Y_test, probabilities, metrics["accuracy"]
    )

    # 7. Probability distribution
    print("\n[7/7] Computing probability distribution...")
    prob_dist = compute_probability_distribution(probabilities)

    # Load training history if available
    training_history = load_training_history()
    training_steps = len(training_history["steps"]) if training_history and "steps" in training_history else 100

    elapsed = time.time() - start_time

    # =================== PRINT RESULTS ===================
    print("\n" + "=" * 60)
    print("  EVALUATION RESULTS")
    print("=" * 60)

    print(f"\n  {'Metric':<30s} {'Value':>10s}  {'Percentage':>10s}")
    print("  " + "-" * 55)
    for key, label in [
        ("accuracy", "Accuracy"),
        ("precision", "Precision"),
        ("recall", "Recall / Sensitivity"),
        ("f1_score", "F1 Score"),
        ("balanced_accuracy", "Balanced Accuracy"),
        ("specificity", "Specificity"),
        ("mcc", "Matthews Corr. Coeff."),
        ("cohen_kappa", "Cohen's Kappa"),
        ("auc_roc", "AUC-ROC"),
        ("auc_pr", "AUC-PR"),
        ("ppv", "Positive Pred. Value"),
        ("npv", "Negative Pred. Value"),
        ("fpr", "False Positive Rate"),
        ("fnr", "False Negative Rate"),
    ]:
        val = metrics[key]
        print(f"  {label:<30s} {val:>10.4f}  {val*100:>9.2f}%")

    print(f"\n  {'Log Loss':<30s} {metrics['log_loss']:>10.6f}")

    cm = metrics["confusion_matrix"]
    print(f"\n  Confusion Matrix:")
    print(f"                    Predicted")
    print(f"                  No Risk   Risk")
    print(f"  Actual No Risk   {cm['tn']:5d}    {cm['fp']:5d}")
    print(f"         Risk      {cm['fn']:5d}    {cm['tp']:5d}")

    print(f"\n  Probability Distribution:")
    print(f"    Mean: {prob_dist['mean']:.4f}  Std: {prob_dist['std']:.4f}")
    print(f"    Min:  {prob_dist['min']:.4f}  Max: {prob_dist['max']:.4f}")
    print(f"    Q25:  {prob_dist['q25']:.4f}  Q75: {prob_dist['q75']:.4f}")

    print(f"\n  Risk Tier Distribution:")
    for tier, count in prob_dist["risk_tiers"].items():
        pct = count / len(Y_test) * 100
        print(f"    {tier:10s}: {count:5d}  ({pct:5.1f}%)")

    print(f"\n  Feature Importance (Top 5):")
    for fi in feature_importance[:5]:
        print(f"    {fi['feature_name']:15s}: {fi['importance']:.4f}")

    print(f"\n  Evaluation completed in {elapsed:.1f}s")

    # =================== SAVE JSON ===================
    results = {
        "model_config": {
            "qubits": QUBITS,
            "layers": LAYERS,
            "total_parameters": LAYERS * QUBITS * 3,
            "device": "default.qubit",
            "embedding": "AngleEmbedding (Y-rotation)",
            "variational_layer": "StronglyEntanglingLayers",
            "measurement": "PauliZ(0) expectation",
            "optimizer": "Adam",
            "learning_rate": 0.01,
            "batch_size": 96,
            "training_steps": training_steps,
            "loss_function": "Mean Squared Error"
        },
        "dataset": {
            "total_samples": len(X_train) + len(X_test),
            "train_samples": len(X_train),
            "test_samples": len(X_test),
            "train_positive": int(np.sum(Y_train)),
            "train_negative": int(len(Y_train) - np.sum(Y_train)),
            "test_positive": int(np.sum(Y_test)),
            "test_negative": int(len(Y_test) - np.sum(Y_test)),
            "split_ratio": "80/20",
            "feature_columns": feature_cols,
            "test_positive_rate": float(np.mean(Y_test)),
            "train_positive_rate": float(np.mean(Y_train)),
        },
        "split_meta": split_meta,
        "metrics": metrics,
        "train_metrics": train_metrics,
        "roc_curve": roc_data,
        "pr_curve": pr_data,
        "threshold_analysis": threshold_analysis,
        "feature_importance": feature_importance,
        "probability_distribution": prob_dist,
        "training_history": training_history,
        "evaluation_time_seconds": round(elapsed, 2)
    }

    # Save to multiple locations
    output_paths = [
        'backend/evaluation_results.json',
        'docs/src/data/evaluationResults.json'
    ]
    for out_path in output_paths:
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        try:
            with open(out_path, 'w') as f:
                json.dump(results, f, indent=2)
            print(f"  Saved results to {out_path}")
        except Exception as e:
            print(f"  Could not save to {out_path}: {e}")

    print("\n" + "=" * 60)
    print("  EVALUATION COMPLETE")
    print("=" * 60)

    return results


if __name__ == "__main__":
    try:
        results = evaluate_model()
    except Exception as e:
        print(f"\nError during evaluation: {e}")
        import traceback
        traceback.print_exc()
