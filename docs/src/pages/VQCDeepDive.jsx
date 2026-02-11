import { Cpu, Layers, RotateCw, Eye, Settings } from 'lucide-react';

export default function VQCDeepDive() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 mb-2">VQC Deep Dive</h1>
                <p className="text-slate-600">Inside the Variational Quantum Classifier — circuit anatomy, parameterized gates, and the training loop.</p>
            </div>

            {/* What is a VQC */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-indigo-900 mb-3">What is a Variational Quantum Classifier?</h2>
                <p className="text-indigo-800 text-sm leading-relaxed mb-4">
                    A VQC is a <strong>hybrid quantum-classical</strong> machine learning model. The quantum circuit acts as a parameterized function (like a neural network), while a classical optimizer adjusts the parameters to minimize a loss function. It combines the expressive power of quantum mechanics with the optimization capabilities of classical computing.
                </p>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white/80 rounded-lg p-4 border border-indigo-100">
                        <div className="font-bold text-indigo-900 mb-1">Quantum Part</div>
                        <p className="text-indigo-700 text-xs">The circuit encodes data and processes it through parameterized gates. Exploits superposition and entanglement for feature interactions.</p>
                    </div>
                    <div className="bg-white/80 rounded-lg p-4 border border-indigo-100">
                        <div className="font-bold text-indigo-900 mb-1">Classical Part</div>
                        <p className="text-indigo-700 text-xs">The optimizer (Adam) computes gradients and updates gate parameters. Standard backpropagation adapted for quantum circuits.</p>
                    </div>
                    <div className="bg-white/80 rounded-lg p-4 border border-indigo-100">
                        <div className="font-bold text-indigo-900 mb-1">Hybrid Loop</div>
                        <p className="text-indigo-700 text-xs">Forward pass: quantum circuit. Backward pass: classical gradient descent. Iterates until convergence.</p>
                    </div>
                </div>
            </div>

            {/* Circuit Anatomy */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-blue-600" /> Circuit Anatomy
                </h2>
                <p className="text-sm text-slate-700 mb-6">Our quantum circuit has three distinct phases. Here is the complete code:</p>

                <div className="bg-slate-900 rounded-xl p-6 mb-6 overflow-x-auto">
                    <pre className="text-sm font-mono text-green-400 leading-relaxed">
{`@qml.qnode(dev)
def circuit(weights, x):
    # PHASE 1: Data Encoding
    # Each of the 14 features rotates its qubit by x * π
    qml.AngleEmbedding(
        features=x * np.pi,
        wires=range(14),
        rotation='Y'
    )

    # PHASE 2: Variational Processing
    # 2 layers of parameterized rotations + CNOT entanglement
    qml.StronglyEntanglingLayers(
        weights,        # Shape: (2, 14, 3) = 84 parameters
        wires=range(14)
    )

    # PHASE 3: Measurement
    # Collapse to expectation value on qubit 0
    return qml.expval(qml.PauliZ(0))`}
                    </pre>
                </div>

                {/* Phase 1 */}
                <div className="border-l-4 border-blue-400 pl-6 mb-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <RotateCw className="w-5 h-5 text-blue-500" /> Phase 1: AngleEmbedding
                    </h3>
                    <div className="text-sm text-slate-700 space-y-3">
                        <p>
                            <strong>Purpose:</strong> Encode classical data into quantum states. Each feature value becomes a rotation angle.
                        </p>
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="font-mono text-xs space-y-1">
                                <div className="text-blue-800">For each feature x_i (i = 0 to 13):</div>
                                <div className="text-blue-600">  θ_i = x_i × π</div>
                                <div className="text-blue-600">  Apply RY(θ_i) to qubit i</div>
                                <div className="text-slate-500 mt-2">Example: Anxiety = 0.9</div>
                                <div className="text-slate-500">  θ = 0.9 × π = 2.827 radians</div>
                                <div className="text-slate-500">  Qubit rotated 90% toward |1⟩ (risk)</div>
                            </div>
                        </div>
                        <p>
                            <strong>Why Y-rotation?</strong> The RY gate rotates the qubit on the Bloch sphere around the Y-axis, which maps real-valued data to quantum states smoothly without introducing complex phases. This is the most common choice for data encoding.
                        </p>
                        <p>
                            <strong>14 qubits = 14 features.</strong> Each qubit independently encodes one symptom dimension. After this phase, the quantum state represents the entire patient profile in parallel superposition.
                        </p>
                    </div>
                </div>

                {/* Phase 2 */}
                <div className="border-l-4 border-violet-400 pl-6 mb-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-violet-500" /> Phase 2: StronglyEntanglingLayers
                    </h3>
                    <div className="text-sm text-slate-700 space-y-3">
                        <p>
                            <strong>Purpose:</strong> Create learnable correlations between all features through parameterized rotations and entangling CNOT gates.
                        </p>
                        <p>
                            Each layer consists of two sub-operations applied to every qubit:
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-violet-50 p-4 rounded-lg border border-violet-100">
                                <div className="font-bold text-violet-900 mb-2">a) Three Rotations per Qubit</div>
                                <div className="font-mono text-xs text-violet-700 space-y-1">
                                    <div>RZ(w₁) — rotation around Z-axis</div>
                                    <div>RY(w₂) — rotation around Y-axis</div>
                                    <div>RZ(w₃) — rotation around Z-axis</div>
                                </div>
                                <p className="text-xs text-violet-600 mt-2">3 parameters per qubit × 14 qubits × 2 layers = <strong>84 total parameters</strong></p>
                            </div>
                            <div className="bg-violet-50 p-4 rounded-lg border border-violet-100">
                                <div className="font-bold text-violet-900 mb-2">b) CNOT Entanglement Pattern</div>
                                <div className="font-mono text-xs text-violet-700 space-y-1">
                                    <div>CNOT(0→1), CNOT(1→2), ...</div>
                                    <div>CNOT(12→13), CNOT(13→0)</div>
                                    <div>Circular connectivity pattern</div>
                                </div>
                                <p className="text-xs text-violet-600 mt-2">Each qubit entangled with its neighbors — information flows across all 14 features.</p>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <div className="font-bold text-slate-800 mb-2">Parameter Count Breakdown</div>
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="text-left text-slate-500">
                                        <th className="pb-2">Component</th>
                                        <th className="pb-2">Count</th>
                                        <th className="pb-2">Calculation</th>
                                    </tr>
                                </thead>
                                <tbody className="font-mono">
                                    <tr><td>Qubits</td><td>14</td><td>One per feature</td></tr>
                                    <tr><td>Rotations per qubit</td><td>3</td><td>RZ, RY, RZ</td></tr>
                                    <tr><td>Layers</td><td>2</td><td>Depth of circuit</td></tr>
                                    <tr className="font-bold border-t border-slate-200"><td>Total Parameters</td><td>84</td><td>14 × 3 × 2</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <p>
                            <strong>Why "Strongly" Entangling?</strong> Unlike BasicEntanglerLayers (which only use one rotation per qubit), StronglyEntanglingLayers use three rotations (RZ-RY-RZ decomposition), giving each qubit maximum rotational freedom. This allows the circuit to represent any single-qubit unitary operation — maximizing expressibility.
                        </p>
                    </div>
                </div>

                {/* Phase 3 */}
                <div className="border-l-4 border-emerald-400 pl-6 mb-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <Eye className="w-5 h-5 text-emerald-500" /> Phase 3: PauliZ Measurement
                    </h3>
                    <div className="text-sm text-slate-700 space-y-3">
                        <p>
                            <strong>Purpose:</strong> Extract a classical prediction from the quantum state.
                        </p>
                        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                            <div className="font-mono text-xs text-emerald-700 space-y-2">
                                <div>return qml.expval(qml.PauliZ(0))</div>
                                <div className="text-slate-500 mt-2">// Measures expectation value of Pauli-Z on qubit 0</div>
                                <div className="text-slate-500">// Output range: [-1, +1]</div>
                                <div className="text-slate-500">// -1 = maximum risk, +1 = maximum safety</div>
                            </div>
                        </div>
                        <p>
                            <strong>Why only Qubit 0?</strong> Because all 14 qubits are entangled through the StronglyEntanglingLayers, the state of Qubit 0 contains information about ALL features. The entanglement propagates influence from every feature to every qubit. Measuring one is sufficient.
                        </p>
                        <p>
                            <strong>Conversion to probability:</strong>
                        </p>
                        <div className="bg-slate-50 p-4 rounded-lg font-mono text-xs">
                            <div>risk_probability = (expectation_value + 1) / 2</div>
                            <div className="text-slate-500 mt-1">// Maps [-1, +1] → [0, 1]</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Weights Matrix */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-slate-600" /> The Weights Matrix
                </h2>
                <div className="text-sm text-slate-700 space-y-3">
                    <p>The trainable parameters are stored in a 3D NumPy array:</p>
                    <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-green-400">
                        <div>weights = np.random.random((2, 14, 3), requires_grad=True)</div>
                        <div className="text-slate-500 mt-2"># Shape: (layers, qubits, rotations_per_qubit)</div>
                        <div className="text-slate-500"># [2][14][3] = 84 trainable floating-point numbers</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-4">
                        <div className="font-bold text-slate-800 mb-2">How to read weights[L][Q][R]:</div>
                        <ul className="space-y-1 text-xs">
                            <li><strong>L</strong> — Layer index (0 or 1). Which entangling layer.</li>
                            <li><strong>Q</strong> — Qubit index (0-13). Which feature's qubit.</li>
                            <li><strong>R</strong> — Rotation index (0-2). Which rotation gate (RZ₁, RY, RZ₂).</li>
                        </ul>
                        <p className="text-xs text-slate-600 mt-2">
                            Example: <code className="bg-white px-1 rounded">weights[1][4][2]</code> = the second RZ rotation of the Anxiety qubit in layer 2.
                        </p>
                    </div>
                    <p>
                        After training, these 84 numbers are saved to <code className="bg-slate-100 px-1 rounded">quantum_weights.npy</code> and loaded at inference time. They encode everything the model has learned about the relationship between symptoms and risk.
                    </p>
                </div>
            </div>

            {/* Comparison */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-xl p-6 text-white">
                <h2 className="text-xl font-bold mb-4">VQC vs. Classical Neural Network</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-slate-400">
                                <th className="pb-3">Property</th>
                                <th className="pb-3">Our VQC</th>
                                <th className="pb-3">Equivalent NN</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-300">
                            <tr className="border-t border-slate-700"><td className="py-2 font-bold">Parameters</td><td>84</td><td>~500-1000+</td></tr>
                            <tr className="border-t border-slate-700"><td className="py-2 font-bold">Feature Interactions</td><td>Quantum entanglement (all-to-all)</td><td>Weight matrices (layer-by-layer)</td></tr>
                            <tr className="border-t border-slate-700"><td className="py-2 font-bold">Expressibility</td><td>Exponential state space (2¹⁴ = 16,384 dims)</td><td>Linear in layer width</td></tr>
                            <tr className="border-t border-slate-700"><td className="py-2 font-bold">Training</td><td>Parameter-shift rule gradients</td><td>Backpropagation</td></tr>
                            <tr className="border-t border-slate-700"><td className="py-2 font-bold">Accuracy</td><td>99.93%</td><td>Comparable with more params</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
