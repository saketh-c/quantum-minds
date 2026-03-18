import { Atom, Zap, BarChart3, Brain, GitBranch, Layers } from 'lucide-react';

const quantumConcepts = [
    {
        title: 'Qubit (Superposition)',
        icon: Atom,
        analogy: 'Like a spinning coin — not just heads or tails, but both at once',
        description: 'A qubit can exist in a superposition of states |0⟩ and |1⟩ simultaneously, represented as α|0⟩ + β|1⟩',
        example: 'If a patient has moderate anxiety (0.5), the qubit is tilted halfway between "safe" and "risk" states'
    },
    {
        title: 'Rotation (Data Encoding)',
        icon: Zap,
        analogy: 'Tilting the spinning coin based on patient data',
        description: 'AngleEmbedding rotates qubits by θ = x × π, where x is the normalized feature value (0-1)',
        example: 'High anxiety (0.9) → large rotation → qubit mostly in |1⟩ (risk state)'
    },
    {
        title: 'CNOT Gate (Entanglement)',
        icon: GitBranch,
        analogy: 'If-then connection: "If anxiety is high, flip the sleep state"',
        description: 'Controlled-NOT gate creates dependencies between qubits, linking symptoms together',
        example: 'Anxiety qubit controls sleep qubit → captures "anxiety-induced insomnia" interaction'
    },
    {
        title: 'Entanglement',
        icon: Layers,
        analogy: 'Two coins spinning together — measuring one instantly affects the other',
        description: 'Qubits become mathematically linked, representing complex symptom interactions',
        example: 'Sleep, anxiety, and cognition become a single entangled system, not three independent factors'
    },
    {
        title: 'Measurement (Prediction)',
        icon: BarChart3,
        analogy: 'Stopping the spin and reading the result',
        description: 'PauliZ measurement on qubit 0 returns expectation value ⟨Z⟩ between -1 and +1',
        example: '⟨Z⟩ = 0.6 → Risk Probability = (0.6 + 1) / 2 = 0.8 = 80% risk'
    }
];

const circuitSteps = [
    {
        step: 1,
        title: 'Feature Input',
        description: '14 normalized features (0-1 scale) representing cognitive, emotional, lifestyle, and environmental factors',
        code: 'features = [0.3, 0.7, 0.5, ...]  # 14 values'
    },
    {
        step: 2,
        title: 'AngleEmbedding',
        description: 'Each feature is encoded as a Y-rotation on its corresponding qubit',
        code: 'qml.AngleEmbedding(features=x * np.pi, wires=range(14), rotation=\'Y\')'
    },
    {
        step: 3,
        title: 'StronglyEntanglingLayers',
        description: '5 layers of parameterized rotations and CNOT gates to create feature interactions',
        code: 'qml.StronglyEntanglingLayers(weights, wires=range(14))'
    },
    {
        step: 4,
        title: 'PauliZ Measurement',
        description: 'Measure the expectation value of the Z operator on qubit 0',
        code: 'return qml.expval(qml.PauliZ(0))  # Returns value in [-1, 1]'
    },
    {
        step: 5,
        title: 'Probability Conversion',
        description: 'Map quantum expectation to risk probability',
        code: 'risk_prob = (exp_val + 1) / 2  # Maps [-1,1] to [0,1]'
    }
];

const featureMapping = [
    { index: 0, name: 'Cognitive Connectivity', source: 'Neural Strike Game', category: 'Neurocognitive' },
    { index: 1, name: 'Memory Function', source: 'Reactor Sabotage Game', category: 'Neurocognitive' },
    { index: 2, name: 'Sleep Quality', source: 'Survey', category: 'Lifestyle' },
    { index: 3, name: 'Developmental Stage', source: 'Estimated (0.5)', category: 'Demographic' },
    { index: 4, name: 'Anxiety Level', source: 'Voice (Hume AI)', category: 'Emotional' },
    { index: 5, name: 'Social Isolation', source: 'Voice (Hume AI)', category: 'Emotional' },
    { index: 6, name: 'Substance Risk', source: 'Survey', category: 'Behavioral' },
    { index: 7, name: 'Diet Quality', source: 'Survey', category: 'Lifestyle' },
    { index: 8, name: 'Academic Pressure', source: 'Survey', category: 'Environmental' },
    { index: 9, name: 'Family History', source: 'Estimated (0.5)', category: 'Genetic' },
    { index: 10, name: 'Bullying Exposure', source: 'Estimated (0.5)', category: 'Environmental' },
    { index: 11, name: 'Safety Perception', source: 'Estimated (0.5)', category: 'Environmental' },
    { index: 12, name: 'Social Monitoring', source: 'Estimated (0.5)', category: 'Environmental' },
    { index: 13, name: 'Physical Activity', source: 'Estimated (0.5)', category: 'Lifestyle' }
];

export default function AcademicModelExplanation() {
    return (
        <div className="font-serif max-w-5xl mx-auto space-y-12 pb-20 print:space-y-8 print:pb-0">
            {/* Header */}
            <div className="border-b-2 border-black pb-4">
                <h1 className="text-3xl font-bold text-black uppercase tracking-wide">
                    Quantum Model Explanation
                </h1>
                <p className="text-gray-700 italic mt-1">
                    Variational Quantum Classifier (VQC) Circuit & Feature Mapping
                </p>
            </div>

            {/* Quantum Concepts */}
            <section>
                <h2 className="text-lg font-bold text-black uppercase border-b border-gray-400 mb-4 pb-1">
                    1. Fundamental Quantum Concepts
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse border border-black">
                        <thead className="bg-gray-100 text-black border-b border-black">
                            <tr>
                                <th className="border-r border-black px-4 py-2 w-1/5">Concept</th>
                                <th className="border-r border-black px-4 py-2 w-1/4">Analogy</th>
                                <th className="border-r border-black px-4 py-2">Technical Description</th>
                                <th className="px-4 py-2">Clinical Example</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-300">
                            {quantumConcepts.map((concept) => (
                                <tr key={concept.title}>
                                    <td className="border-r border-black px-4 py-2 font-bold">{concept.title}</td>
                                    <td className="border-r border-black px-4 py-2 italic">{concept.analogy}</td>
                                    <td className="border-r border-black px-4 py-2">{concept.description}</td>
                                    <td className="px-4 py-2 text-xs">{concept.example}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Circuit Flow */}
            <section>
                <h2 className="text-lg font-bold text-black uppercase border-b border-gray-400 mb-4 pb-1">
                    2. Quantum Circuit Data Flow
                </h2>
                <div className="space-y-4">
                    {circuitSteps.map((step) => (
                        <div key={step.step} className="border border-black p-4 flex gap-4">
                            <div className="w-8 h-8 flex items-center justify-center border border-black rounded-full font-bold text-lg flex-shrink-0">
                                {step.step}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-black mb-1">{step.title}</h3>
                                <p className="text-sm text-gray-800 mb-2">{step.description}</p>
                                <code className="block bg-gray-100 p-2 font-mono text-xs border border-gray-300">
                                    {step.code}
                                </code>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Feature Mapping */}
            <section>
                <h2 className="text-lg font-bold text-black uppercase border-b border-gray-400 mb-4 pb-1">
                    3. Qubit Feature Mapping (14 Qubits)
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse border border-black">
                        <thead className="bg-gray-100 text-black border-b border-black">
                            <tr>
                                <th className="border-r border-black px-4 py-2 w-16">Qubit</th>
                                <th className="border-r border-black px-4 py-2">Feature Name</th>
                                <th className="border-r border-black px-4 py-2">Data Source</th>
                                <th className="px-4 py-2">Category</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-300">
                            {featureMapping.map((feature, i) => (
                                <tr key={feature.index} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="border-r border-black px-4 py-2 font-bold text-center">{feature.index}</td>
                                    <td className="border-r border-black px-4 py-2 font-semibold">{feature.name}</td>
                                    <td className="border-r border-black px-4 py-2">{feature.source}</td>
                                    <td className="px-4 py-2 italic">{feature.category}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
