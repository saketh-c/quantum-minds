import React from 'react';
import { Network, Code, Calculator, Cpu } from 'lucide-react';

export default function AcademicModelDeepDive() {
    return (
        <div className="font-serif max-w-5xl mx-auto p-8 bg-white text-black print:p-0 print:max-w-none">
            {/* Header */}
            <div className="border-b-4 border-black pb-6 mb-8 text-center">
                <h1 className="text-4xl font-bold uppercase tracking-tight mb-2">
                    Variational Quantum Classifier: <br /> Mathematical & Architectural Deep Dive
                </h1>
                <div className="flex justify-center gap-8 mt-4 text-sm font-sans uppercase tracking-widest text-gray-600">
                    <span className="flex items-center gap-2"><Cpu className="w-4 h-4" /> 14-Qubit System</span>
                    <span className="flex items-center gap-2"><Network className="w-4 h-4" /> Strongly Entangled Layers</span>
                    <span className="flex items-center gap-2"><Calculator className="w-4 h-4" /> COBYLA Optimization</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* ── LEFT COLUMN ── */}
                <div className="space-y-8">

                    {/* Hamiltonian Formulation */}
                    <section>
                        <h2 className="text-2xl font-bold uppercase border-b-2 border-black mb-4 flex items-center gap-2">
                            <span className="bg-black text-white px-2 py-1 text-sm">A</span> Mathematical Formulation
                        </h2>
                        <div className="text-justify leading-relaxed text-sm space-y-4">
                            <p>
                                The core of our classifier is a variational quantum circuit $U(\theta)$ acting on a 14-qubit state $|\psi\rangle$.
                                The objective is to minimize the expectation value of a cost Hamiltonian $H$:
                            </p>
                            <div className="border border-black p-4 bg-gray-50 font-mono text-center my-4 text-xs">
                                {'$$ \\min_{\\theta} \\mathcal{L}(\\theta) = \\langle \\psi(\\theta) | H | \\psi(\\theta) \\rangle $$'}
                            </div>
                            <p>
                                where {'|\\psi(\\theta)\\rangle = U(\\theta)|0\\rangle^{\\otimes n}'}. The unitary {'U(\\theta)'} is composed
                                of {'L'} layers of rotational gates and CNOT entanglers:
                            </p>
                            <div className="border border-black p-4 bg-gray-50 font-mono text-center my-4 text-xs">
                                {'$$ U(\\theta) = \\prod_{l = 1}^{L} \\left( U_{\\text{ENT}} \\cdot \\bigotimes_{i = 0}^{n - 1} R(\\alpha_{l, i}, \\beta_{l, i}, \\gamma_{l, i}) \right) $$'}
                            </div>
                            <p>
                                We utilize <strong>StronglyEntanglingLayers</strong> which apply single-qubit rotations followed by
                                a cascade of CNOT gates, maximizing the expressibility of the Hilbert space.
                            </p>
                        </div>
                    </section>

                    {/* Feature Map Table */}
                    <section>
                        <h2 className="text-2xl font-bold uppercase border-b-2 border-black mb-4 flex items-center gap-2">
                            <span className="bg-black text-white px-2 py-1 text-sm">B</span> Feature Embedding Map
                        </h2>
                        <p className="text-sm mb-4">Each clinical feature is normalized to $[0, \pi]$ and encoded into the rotation angle of a qubit.</p>
                        <table className="w-full text-xs border-collapse border border-black">
                            <thead className="bg-black text-white">
                                <tr>
                                    <th className="p-2 border border-white text-left">Qubit</th>
                                    <th className="p-2 border border-white text-left">Feature Source</th>
                                    <th className="p-2 border border-white text-left">Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    ['q0', 'Cognitive', 'Reaction Time (ms)'],
                                    ['q1', 'Cognitive', 'Accuracy Rate (%)'],
                                    ['q2', 'Cognitive', 'Focus Duration'],
                                    ['q3', 'Cognitive', 'Memory Span'],
                                    ['q4', 'Hume AI', 'Anxiety Score'],
                                    ['q5', 'Hume AI', 'Depression Score'],
                                    ['q6', 'Hume AI', 'Tiredness Score'],
                                    ['q7', 'Survey', 'Sleep Hours'],
                                    ['q8', 'Survey', 'Social Interaction'],
                                    ['q9', 'Survey', 'Stress Level (1-10)'],
                                    ['q10', 'Survey', 'Exercise Freq'],
                                    ['q11', 'Survey', 'Academic Pressure'],
                                    ['q12', 'Survey', 'Diet Quality'],
                                    ['q13', 'Survey', 'Substance Use']
                                ].map(([q, src, desc], i) => (
                                    <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                        <td className="p-2 border border-gray-300 font-mono font-bold">{q}</td>
                                        <td className="p-2 border border-gray-300">{src}</td>
                                        <td className="p-2 border border-gray-300">{desc}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>

                </div>

                {/* ── RIGHT COLUMN ── */}
                <div className="space-y-8">

                    {/* Circuit Diagram Visual */}
                    <section>
                        <h2 className="text-2xl font-bold uppercase border-b-2 border-black mb-4 flex items-center gap-2">
                            <span className="bg-black text-white px-2 py-1 text-sm">C</span> Circuit Architecture
                        </h2>
                        <div className="border border-black p-4 bg-white relative">
                            <div className="absolute top-2 right-2 text-xs font-mono bg-black text-white px-2 py-0.5">Depth=5 Layers</div>

                            {/* Simplified CSS Circuit Representation */}
                            <div className="space-y-3 font-mono text-xs my-4">
                                {[0, 1, 2, 3, '...', 13].map((q, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <span className="w-8 font-bold text-right text-gray-500">q[{q}]</span>
                                        <div className="flex-1 flex items-center relative h-6">
                                            {/* Wire */}
                                            <div className="absolute w-full h-0.5 bg-black z-0"></div>

                                            {/* Gates */}
                                            <div className="z-10 w-8 h-6 bg-white border border-black flex items-center justify-center mx-2 shadow-sm">Hb</div>
                                            <div className="z-10 w-12 h-6 bg-gray-100 border border-black flex items-center justify-center mx-2 text-[10px]">Ry(θ)</div>
                                            <div className="z-10 w-6 h-6 rounded-full bg-black text-white flex items-center justify-center mx-2 text-[10px]">●</div>
                                            <div className="z-10 w-12 h-6 bg-gray-100 border border-black flex items-center justify-center mx-2 text-[10px]">Rot</div>
                                            <div className="z-10 w-6 h-6 rounded-full border-2 border-black bg-white flex items-center justify-center mx-2 text-lg leading-none pb-1">⊕</div>
                                            <div className="z-10 w-10 h-6 bg-black text-white flex items-center justify-center mx-2 ml-auto">MEAS</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-center italic mt-2 text-gray-500">Figure 2: Schematic representation of the 14-qubit variational circuit showing Hadamard embedding, parametric rotations, and entangling CNOTs.</p>
                        </div>
                    </section>

                    {/* PennyLane Implementation Code */}
                    <section>
                        <h2 className="text-2xl font-bold uppercase border-b-2 border-black mb-4 flex items-center gap-2">
                            <span className="bg-black text-white px-2 py-1 text-sm">D</span> Implementation (PennyLane)
                        </h2>
                        <div className="border border-black bg-gray-50 p-4 text-xs font-mono overflow-x-auto">
                            <pre>{`import pennylane as qml
from pennylane import numpy as np

n_qubits = 14
dev = qml.device("default.qubit", wires=n_qubits)

@qml.qnode(dev)
def quantum_classifier(inputs, weights):
    # 1. Feature Encoding (Angle Embedding)
    qml.templates.AngleEmbedding(inputs, wires=range(n_qubits))
    
    # 2. Variational Layers
    qml.templates.StronglyEntanglingLayers(weights, wires=range(n_qubits))
    
    # 3. Measurement (Expectation Value of PauliZ on q0)
    return qml.expval(qml.PauliZ(0))

# Optimization
opt = qml.COBYLAOptimizer(stepsize=0.1)
weights = np.random.random(shape, requires_grad=True)
`}</pre>
                        </div>
                        <p className="text-xs mt-2 text-gray-600">
                            <strong>Listing 1:</strong> Core Python definition of the quantum node using PennyLane.
                            The <code>StronglyEntanglingLayers</code> template handles the complex ansatz construction automatically.
                        </p>
                    </section>

                </div>
            </div>

            {/* Footer */}
            <div className="text-xs font-mono text-center border-t border-black pt-4 mt-12 flex justify-between">
                <span>Quantum Mind Project | Deep Dive</span>
                <span>Page 5</span>
            </div>
        </div>
    );
}
