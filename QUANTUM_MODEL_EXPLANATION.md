# Understanding the Quantum Mind Model
**A Comprehensive Guide to Quantum Mental Health Detection**

This document details the technology behind our application. We use a **Variational Quantum Classifier (VQC)**, a type of quantum machine learning model, to analyze interactions between clinical symptoms and assess mental health risk.

<details>
<summary><strong>What is Quantum Machine Learning? (Click to Expand)</strong></summary>
Traditional machine learning uses classical bits (0 or 1). Quantum Machine Learning (QML) uses <strong>qubits</strong>. Because qubits can exist in a state of superposition (representing multiple possibilities at once) and can be entangled (instantly correlated), they are theoretically capable of capturing highly complex, non-linear relationships in data that are computationally expensive for classical computers.
</details>

---

## Part 1: Fundamental Concepts

Before diving into the model, let's understand the building blocks.

### 1. The Qubit (Superposition)
In a classical computer, a bit is like a coin glued to a table: it is either Heads (0) or Tails (1).
A **Qubit** is like a spinning coin. While it's spinning, it is not just Heads or Tails—it is in a state of **Superposition**, representing a probability of landing on either.

| Feature | Classical Bit | Quantum Qubit |
| :--- | :--- | :--- |
| **State** | 0 OR 1 | $\alpha|0\rangle + \beta|1\rangle$ (Both at once) |
| **Analogy** | Light Switch | Dimmer Switch |
| **Power** | Linear Processing | Parallel Processing |

### 2. Rotation (Encoding Data)
How do we get patient data into a spinning coin? We "tilt" the spin.
If a patient has High Anxiety (0.9), we rotate the qubit to be mostly "Heads" (Risk).
If a patient has Low Anxiety (0.1), we rotate it to be mostly "Tails" (Safe).
*   **Formula:** $\theta = x \times \pi$

---

## Part 2: The Mechanics of Interaction (Deep Dive)

This is the most critical part of our model: how different symptoms "talk" to each other.

### 3. The CNOT Gate (Controlled-NOT)
The **CNOT** gate is the quantum version of an "If-Then" statement. It connects two qubits: a **Control** and a **Target**.

*   **The Rule:** "If the Control qubit is active (Heads), FLIP the Target qubit. If the Control is inactive (Tails), do nothing."
*   **Why does this matter?** It creates a dependency. The state of the Target now *depends* on the state of the Control.

### 4. Entanglement
When we apply CNOT gates to qubits that are already in Superposition (spinning), something magical happens: **Entanglement**.
The two qubits become mathematically linked. You can no longer describe them as two separate coins. They are a single system.

*   **Clinical Example:**
    *   **Qubit A (Anxiety)** is spinning (High Risk).
    *   **Qubit B (Sleep)** is spinning (Poor Sleep).
    *   **CNOT(A, B):** Now, "Sleep" is directly tied to "Anxiety". If Anxiety spikes, the CNOT gate ensures the definition of "Sleep Risk" flips or changes accordingly.
    *   **Result:** The model extracts a new feature: "Anxiety-Induced Insomnia", which is a stronger predictor of crisis than either symptom alone.

---

## Part 3: The Prediction (Measurement)

### 5. Expectation Value
Finally, we stop the spinning and measure. Because quantum mechanics is probabilistic, measuring once might be lucky or unlucky.
To get a reliable score, we calculate the **Expectation Value** ($\langle Z \rangle$).
*   Risk Score = (Average Spin Direction + 1) / 2
*   This gives us a smooth number from 0% (Safe) to 100% (Crisis).

---

## Code to Concept Mapping

This section connects the concepts above to the actual Python code in `backend/train_vqc.py`.

### 1. Defining the Circuit
The entire quantum model is defined in the `circuit` function using the `@qml.qnode` decorator.

```python
# From backend/train_vqc.py

@qml.qnode(dev)
def circuit(weights, x):
    # PHASE 1: Embedding
    # Rotates qubits based on input features 'x'.
    qml.AngleEmbedding(features=x * np.pi, wires=range(QUBITS), rotation='Y')
    
    # PHASE 2: Entanglement
    # Applies layers of rotations and CNOT gates to create correlations.
    qml.StronglyEntanglingLayers(weights, wires=range(QUBITS))
    
    # PHASE 3: Measurement
    # Returns the expectation value of Z on the first qubit.
    return qml.expval(qml.PauliZ(0))
```

### 2. The Training Loop (How it learns)
The model learns by adjusting the `weights` matrix to minimize error.

```python
# From backend/train_vqc.py

# We use the Adam Optimizer, standard for VQCs
opt = qml.AdamOptimizer(stepsize=LEARNING_RATE)

# Inside the training loop:
# It calculates the gradient of the quantum circuit with respect to the weights
weights, loss_val = opt.step_and_cost(lambda w: cost(w, X_batch, Y_batch), weights)
```

### 3. Prediction Logic
In `app.py`, we take the raw quantum output and convert it to a probability.

```python
# From backend/app.py

# Get raw quantum value (-1 to 1)
exp_val = circuit(weights, x)

# Convert to Probability (0 to 1)
risk_prob = (exp_val + 1) / 2
```
