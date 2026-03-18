import { Atom, Zap, BarChart3, Brain, GitBranch, Layers } from 'lucide-react';

const quantumConcepts = [
    {
        title: 'Qubit (Superposition)',
        icon: Atom,
        color: 'from-violet-500 to-purple-500',
        analogy: 'Like a spinning coin — not just heads or tails, but both at once',
        description: 'A qubit can exist in a superposition of states |0⟩ and |1⟩ simultaneously, represented as α|0⟩ + β|1⟩',
        example: 'If a patient has moderate anxiety (0.5), the qubit is tilted halfway between "safe" and "risk" states'
    },
    {
        title: 'Rotation (Data Encoding)',
        icon: Zap,
        color: 'from-blue-500 to-cyan-500',
        analogy: 'Tilting the spinning coin based on patient data',
        description: 'AngleEmbedding rotates qubits by θ = x × π, where x is the normalized feature value (0-1)',
        example: 'High anxiety (0.9) → large rotation → qubit mostly in |1⟩ (risk state)'
    },
    {
        title: 'CNOT Gate (Entanglement)',
        icon: GitBranch,
        color: 'from-emerald-500 to-teal-500',
        analogy: 'If-then connection: "If anxiety is high, flip the sleep state"',
        description: 'Controlled-NOT gate creates dependencies between qubits, linking symptoms together',
        example: 'Anxiety qubit controls sleep qubit → captures "anxiety-induced insomnia" interaction'
    },
    {
        title: 'Entanglement',
        icon: Layers,
        color: 'from-amber-500 to-orange-500',
        analogy: 'Two coins spinning together — measuring one instantly affects the other',
        description: 'Qubits become mathematically linked, representing complex symptom interactions',
        example: 'Sleep, anxiety, and cognition become a single entangled system, not three independent factors'
    },
    {
        title: 'Measurement (Prediction)',
        icon: BarChart3,
        color: 'from-rose-500 to-red-500',
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
        code: 'features = [0.3, 0.7, 0.5, ...]  # 14 values',
        color: 'bg-blue-50 border-blue-200 text-blue-700'
    },
    {
        step: 2,
        title: 'AngleEmbedding',
        description: 'Each feature is encoded as a Y-rotation on its corresponding qubit',
        code: 'qml.AngleEmbedding(features=x * np.pi, wires=range(14), rotation=\'Y\')',
        color: 'bg-purple-50 border-purple-200 text-purple-700'
    },
    {
        step: 3,
        title: 'StronglyEntanglingLayers',
        description: '5 layers of parameterized rotations and CNOT gates to create feature interactions',
        code: 'qml.StronglyEntanglingLayers(weights, wires=range(14))',
        color: 'bg-emerald-50 border-emerald-200 text-emerald-700'
    },
    {
        step: 4,
        title: 'PauliZ Measurement',
        description: 'Measure the expectation value of the Z operator on qubit 0',
        code: 'return qml.expval(qml.PauliZ(0))  # Returns value in [-1, 1]',
        color: 'bg-amber-50 border-amber-200 text-amber-700'
    },
    {
        step: 5,
        title: 'Probability Conversion',
        description: 'Map quantum expectation to risk probability',
        code: 'risk_prob = (exp_val + 1) / 2  # Maps [-1,1] to [0,1]',
        color: 'bg-rose-50 border-rose-200 text-rose-700'
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

export default function ModelExplanation() {
    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-qm-100 text-qm-700 rounded-full text-sm font-semibold mb-6">
                    <Atom className="w-4 h-4" />
                    Quantum ML Explained
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                    How the Quantum Model Works
                </h1>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                    A visual explanation of our Variational Quantum Classifier (VQC) — from qubits and superposition
                    to entanglement and measurement. No quantum physics degree required.
                </p>
            </div>

            {/* Quantum Concepts */}
            <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Fundamental Concepts</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {quantumConcepts.map((concept) => {
                        const Icon = concept.icon;
                        return (
                            <div key={concept.title} className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                                <div className={`bg-gradient-to-br ${concept.color} p-6 text-white`}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <Icon className="w-8 h-8" />
                                        <h3 className="text-xl font-bold">{concept.title}</h3>
                                    </div>
                                    <p className="text-white/90 text-sm italic">{concept.analogy}</p>
                                </div>
                                <div className="p-6">
                                    <p className="text-slate-700 mb-4 leading-relaxed text-sm">{concept.description}</p>
                                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                        <h4 className="font-semibold text-slate-700 text-xs mb-2">Clinical Example</h4>
                                        <p className="text-xs text-slate-600 leading-relaxed">{concept.example}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Circuit Flow */}
            <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Quantum Circuit Flow</h2>
                <p className="text-slate-600 mb-8 leading-relaxed">
                    The VQC processes patient data through a series of quantum operations. Here's the step-by-step flow:
                </p>
                <div className="space-y-4">
                    {circuitSteps.map((step) => (
                        <div key={step.step} className={`rounded-xl border-2 p-6 ${step.color}`}>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center font-black text-lg flex-shrink-0">
                                    {step.step}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                                    <p className="text-sm mb-3 opacity-90">{step.description}</p>
                                    <div className="bg-slate-900 rounded-lg p-3 font-mono text-xs text-green-400 overflow-x-auto">
                                        {step.code}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Feature Mapping */}
            <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">14 Features → 14 Qubits</h2>
                <p className="text-slate-600 mb-8 leading-relaxed">
                    Each of the 14 mental health features is encoded onto a dedicated qubit. The quantum circuit then
                    entangles these qubits to capture complex interactions between symptoms.
                </p>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left p-4 font-bold text-slate-700">Qubit</th>
                                    <th className="text-left p-4 font-bold text-slate-700">Feature Name</th>
                                    <th className="text-left p-4 font-bold text-slate-700">Data Source</th>
                                    <th className="text-left p-4 font-bold text-slate-700">Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                {featureMapping.map((feature, i) => (
                                    <tr key={feature.index} className={`border-b border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                                        <td className="p-4">
                                            <div className="w-8 h-8 rounded-full bg-qm-100 text-qm-700 flex items-center justify-center font-bold text-xs">
                                                {feature.index}
                                            </div>
                                        </td>
                                        <td className="p-4 font-semibold text-slate-800">{feature.name}</td>
                                        <td className="p-4 text-slate-600">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${feature.source.includes('Game') ? 'bg-blue-100 text-blue-700' :
                                                    feature.source.includes('Voice') ? 'bg-rose-100 text-rose-700' :
                                                        feature.source.includes('Survey') ? 'bg-indigo-100 text-indigo-700' :
                                                            'bg-amber-100 text-amber-700'
                                                }`}>
                                                {feature.source}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-600 text-xs">{feature.category}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Why Quantum? */}
            <div className="bg-gradient-to-br from-qm-950 to-slate-900 rounded-2xl p-8 md:p-12 text-white">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Brain className="w-6 h-6" />
                    Why Quantum Computing for Mental Health?
                </h2>
                <div className="grid md:grid-cols-2 gap-8 text-sm">
                    <div>
                        <h3 className="font-bold text-qm-300 mb-3">The Problem with Classical ML</h3>
                        <p className="text-slate-300 leading-relaxed mb-4">
                            Traditional machine learning treats features independently or uses simple linear combinations.
                            But mental health is not linear — anxiety affects sleep, which affects cognition, which affects
                            academic performance, creating a web of interdependencies.
                        </p>
                        <p className="text-slate-300 leading-relaxed">
                            Classical models struggle to capture these <strong className="text-white">non-linear, multi-way interactions</strong> without
                            exponentially increasing complexity.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold text-qm-300 mb-3">The Quantum Advantage</h3>
                        <p className="text-slate-300 leading-relaxed mb-4">
                            Quantum entanglement naturally represents these complex relationships. When qubits are entangled,
                            they form a single quantum state where changing one qubit instantly affects all others — exactly
                            like how mental health symptoms influence each other.
                        </p>
                        <p className="text-slate-300 leading-relaxed">
                            The VQC's <strong className="text-white">StronglyEntanglingLayers</strong> create these connections automatically,
                            allowing the model to learn which symptom combinations are most predictive of depression risk.
                        </p>
                    </div>
                </div>
            </div>

            {/* Training Details */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Training Process</h2>
                <div className="grid md:grid-cols-3 gap-6 text-sm">
                    <div>
                        <h3 className="font-bold text-qm-700 mb-3">Dataset</h3>
                        <ul className="space-y-2 text-slate-700">
                            <li>• <strong>2,807 samples</strong> (Student Depression Dataset)</li>
                            <li>• 80/20 train/test split</li>
                            <li>• Balanced classes via stratification</li>
                            <li>• Normalized to [0, 1] scale</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-qm-700 mb-3">Hyperparameters</h3>
                        <ul className="space-y-2 text-slate-700">
                            <li>• <strong>14 qubits</strong> (one per feature)</li>
                            <li>• <strong>5 layers</strong> of entangling gates</li>
                            <li>• Adam optimizer (lr=0.01)</li>
                            <li>• Batch size: 32</li>
                            <li>• 500 training steps</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-qm-700 mb-3">Results</h3>
                        <ul className="space-y-2 text-slate-700">
                            <li>• <strong>Accuracy:</strong> ~76-81%</li>
                            <li>• <strong>F1 Score:</strong> ~0.78-0.82</li>
                            <li>• <strong>AUC-ROC:</strong> ~0.85-0.88</li>
                            <li>• Low overfitting (train/test gap &lt;5%)</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}
