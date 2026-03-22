import pennylane as qml
from pennylane import numpy as np
import pandas as pd
import os
import json
from sklearn.model_selection import train_test_split

# CONFIGURATION
STEPS = int(os.environ.get("QM_TRAIN_STEPS", "1000"))
BATCH_SIZE = int(os.environ.get("QM_BATCH_SIZE", "128"))
QUBITS = 14
LAYERS = int(os.environ.get("QM_LAYERS", "6"))
LEARNING_RATE = float(os.environ.get("QM_LR", "0.01"))
SPLIT_SEED = 42

def train_model():
    data_path = 'backend/kaggle_processed.csv'
    if not os.path.exists(data_path):
        print("Data not found.")
        return

    print(f"Loading data from {data_path}...")
    df = pd.read_csv(data_path)
    
    X = df.iloc[:, 0:14].values
    Y = df['Risk_Label'].values * 2 - 1  # {-1, 1}

    # Split (shuffle + stratify for realistic evaluation)
    idx = np.arange(len(X))
    train_idx, test_idx = train_test_split(
        idx,
        test_size=0.2,
        random_state=SPLIT_SEED,
        shuffle=True,
        stratify=(df['Risk_Label'].values if 'Risk_Label' in df.columns else None),
    )
    X_train, X_test = X[train_idx], X[test_idx]
    Y_train, Y_test = Y[train_idx], Y[test_idx]

    os.makedirs('backend', exist_ok=True)
    with open('backend/data_split.json', 'w') as f:
        json.dump(
            {
                "split_seed": SPLIT_SEED,
                "train_idx": [int(i) for i in train_idx],
                "test_idx": [int(i) for i in test_idx],
            },
            f,
            indent=2,
        )

    dev = qml.device("default.qubit", wires=QUBITS)

    @qml.qnode(dev)
    def circuit(weights, x):
        qml.AngleEmbedding(features=x * np.pi, wires=range(QUBITS), rotation='Y')
        qml.StronglyEntanglingLayers(weights, wires=range(QUBITS))
        return qml.expval(qml.PauliZ(0))

    # Resume from existing weights if available, otherwise random init
    weights_path = 'backend/quantum_weights.npy'
    if not os.path.exists(weights_path):
        weights_path = 'quantum_weights.npy'
    if os.path.exists(weights_path):
        print(f"Resuming from existing weights: {weights_path}")
        weights = np.array(np.load(weights_path), requires_grad=True)
    else:
        print("No existing weights found, using random initialization")
        weights = np.random.random((LAYERS, QUBITS, 3), requires_grad=True)

    def cost(weights, x_batch, y_batch):
        preds = np.stack([circuit(weights, x) for x in x_batch])
        # Binary cross-entropy: map [-1,1] to [0,1] probabilities
        probs = (preds + 1) / 2
        labels = (y_batch + 1) / 2
        eps = 1e-7
        probs = np.clip(probs, eps, 1 - eps)
        return -np.mean(labels * np.log(probs) + (1 - labels) * np.log(1 - probs))

    # Adam is better for escaping barren plateaus in VQCs
    opt = qml.AdamOptimizer(stepsize=LEARNING_RATE)

    print("Starting Training...")
    training_history = {"steps": [], "losses": []}

    for i in range(STEPS):
        # Learning rate decay at midpoint
        if i == STEPS // 2:
            opt = qml.AdamOptimizer(stepsize=LEARNING_RATE / 2)
            print(f"Step {i}: Reducing learning rate to {LEARNING_RATE / 2}")

        # Random batch sampling
        indices = np.random.randint(0, len(X_train), BATCH_SIZE)
        X_batch = X_train[indices]
        Y_batch = Y_train[indices]

        weights, loss_val = opt.step_and_cost(lambda w: cost(w, X_batch, Y_batch), weights)

        training_history["steps"].append(i)
        training_history["losses"].append(float(loss_val))

        if i % 10 == 0:
            print(f"Step {i}: Cost = {loss_val:.4f}")

    np.save('backend/quantum_weights.npy', weights)

    # Save training history
    with open('backend/training_history.json', 'w') as f:
        json.dump(training_history, f, indent=2)

    print("Training complete. Weights and history saved.")

if __name__ == "__main__":
    train_model()
