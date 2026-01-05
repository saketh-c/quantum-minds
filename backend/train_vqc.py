import pennylane as qml
from pennylane import numpy as np
import pandas as pd
import os

# CONFIGURATION
STEPS = 100
BATCH_SIZE = 32
QUBITS = 14
LAYERS = 2
LEARNING_RATE = 0.05

def train_model():
    data_path = 'backend/synthetic_clinical_data.csv'
    if not os.path.exists(data_path):
        print("Data not found.")
        return

    print(f"Loading data from {data_path}...")
    df = pd.read_csv(data_path)
    
    X = df.iloc[:, 0:14].values
    Y = df['Risk_Label'].values * 2 - 1  # {-1, 1}

    # Split
    split = int(0.8 * len(X))
    X_train, X_test = X[:split], X[split:]
    Y_train, Y_test = Y[:split], Y[split:]

    dev = qml.device("default.qubit", wires=QUBITS)

    @qml.qnode(dev)
    def circuit(weights, x):
        qml.AngleEmbedding(features=x * np.pi, wires=range(QUBITS), rotation='Y')
        qml.StronglyEntanglingLayers(weights, wires=range(QUBITS))
        return qml.expval(qml.PauliZ(0))

    weights = np.random.random((LAYERS, QUBITS, 3), requires_grad=True)

    def cost(weights, x_batch, y_batch):
        # predictions list of tensor (1,) -> stack to (batch,)
        preds = np.stack([circuit(weights, x) for x in x_batch])
        return np.mean((preds - y_batch) ** 2)

    # Adam is better for escaping barren plateaus in VQCs
    opt = qml.AdamOptimizer(stepsize=LEARNING_RATE)

    print("Starting Training...")
    
    for i in range(STEPS):
        # Random batch sampling
        indices = np.random.randint(0, len(X_train), BATCH_SIZE)
        X_batch = X_train[indices]
        Y_batch = Y_train[indices]
        
        weights, loss_val = opt.step_and_cost(lambda w: cost(w, X_batch, Y_batch), weights)
        
        if i % 10 == 0:
            print(f"Step {i}: Cost = {loss_val:.4f}")

    np.save('backend/quantum_weights.npy', weights)
    print("Training complete. Weights saved.")

if __name__ == "__main__":
    train_model()
