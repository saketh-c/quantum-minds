import { ArrowRight, Brain, Gamepad2, Mic, ClipboardList, BarChart3, LogIn } from 'lucide-react';

const steps = [
    {
        id: 1,
        title: 'Secure Login',
        icon: LogIn,
        description: 'Authentication required to access the quantum mental health assessment system',
        color: 'from-blue-500 to-cyan-500',
        details: ['Username/password authentication', 'JWT token-based session', 'Secure backend validation']
    },
    {
        id: 2,
        title: 'Welcome & Introduction',
        icon: Brain,
        description: 'Overview of the quantum-enhanced mental health triage process',
        color: 'from-purple-500 to-pink-500',
        details: ['Explains quantum ML approach', 'Sets expectations for assessment', 'Introduces multi-modal data collection']
    },
    {
        id: 3,
        title: 'Neural Strike Game',
        icon: Gamepad2,
        description: 'Cognitive connectivity assessment through focus-based gameplay',
        color: 'from-emerald-500 to-teal-500',
        details: ['Measures attention span', 'Tests reaction time', 'Evaluates cognitive connectivity', 'Generates Feature 0: Cognitive Connectivity']
    },
    {
        id: 4,
        title: 'Reactor Sabotage Game',
        icon: Gamepad2,
        description: 'Memory function evaluation through pattern recognition',
        color: 'from-amber-500 to-orange-500',
        details: ['Tests working memory', 'Evaluates pattern recognition', 'Measures hippocampal function', 'Generates Feature 1: Memory Function']
    },
    {
        id: 5,
        title: 'Voice Analysis',
        icon: Mic,
        description: 'Hume AI prosody detection for emotional state assessment',
        color: 'from-rose-500 to-red-500',
        details: ['Records voice sample', 'Analyzes vocal prosody', 'Detects anxiety markers', 'Identifies social isolation indicators', 'Generates Features 4 & 5: Anxiety, Isolation']
    },
    {
        id: 6,
        title: 'Self-Report Survey',
        icon: ClipboardList,
        description: 'Structured questionnaire for lifestyle and environmental factors',
        color: 'from-indigo-500 to-purple-500',
        details: ['Sleep quality rating', 'Substance use assessment', 'Diet quality evaluation', 'Academic pressure measurement', 'Generates Features 2, 6, 7, 8']
    },
    {
        id: 7,
        title: 'Quantum Processing',
        icon: Brain,
        description: '14-qubit Variational Quantum Classifier analyzes entangled mental health factors',
        color: 'from-violet-500 to-fuchsia-500',
        details: ['14 features encoded as qubits', 'Quantum entanglement captures feature interactions', 'VQC computes risk probability', 'Depression probability calculated']
    },
    {
        id: 8,
        title: 'Results Dashboard',
        icon: BarChart3,
        description: 'Comprehensive mental health risk report with actionable insights',
        color: 'from-qm-500 to-qm-700',
        details: ['Depression risk percentage', 'Overall risk tier (Low/Moderate/High/Crisis)', 'Severity level with recommendations', 'Detailed feature breakdown with 1-5 ratings', 'Concerning areas highlighted']
    }
];

export default function UserJourney() {
    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-qm-100 text-qm-700 rounded-full text-sm font-semibold mb-6">
                    <Brain className="w-4 h-4" />
                    User Experience Flow
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                    Complete User Journey
                </h1>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                    From login to results — a step-by-step walkthrough of the Quantum Mind mental health assessment experience.
                    Each stage collects specific data modalities that feed into the quantum classifier.
                </p>
            </div>

            {/* Journey Steps */}
            <div className="space-y-8">
                {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isLast = index === steps.length - 1;

                    return (
                        <div key={step.id} className="relative">
                            {/* Step Card */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                <div className="flex flex-col md:flex-row">
                                    {/* Left: Icon & Number */}
                                    <div className={`bg-gradient-to-br ${step.color} p-8 flex flex-col items-center justify-center text-white md:w-48`}>
                                        <div className="text-6xl font-black opacity-20 mb-2">{step.id}</div>
                                        <Icon className="w-16 h-16 mb-4" />
                                        <div className="text-xs font-bold uppercase tracking-wider opacity-80">Step {step.id}</div>
                                    </div>

                                    {/* Right: Content */}
                                    <div className="flex-1 p-8">
                                        <h3 className="text-2xl font-bold text-slate-900 mb-3">{step.title}</h3>
                                        <p className="text-slate-600 mb-6 leading-relaxed">{step.description}</p>

                                        {/* Details List */}
                                        <div className="space-y-2">
                                            {step.details.map((detail, i) => (
                                                <div key={i} className="flex items-start gap-3">
                                                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${step.color} mt-2 flex-shrink-0`} />
                                                    <span className="text-sm text-slate-700">{detail}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Arrow Connector */}
                            {!isLast && (
                                <div className="flex justify-center my-6">
                                    <ArrowRight className="w-8 h-8 text-slate-300" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Data Flow Summary */}
            <div className="bg-gradient-to-br from-qm-950 to-slate-900 rounded-2xl p-8 md:p-12 text-white">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Brain className="w-6 h-6" />
                    Data Collection Summary
                </h2>
                <div className="grid md:grid-cols-3 gap-6 text-sm">
                    <div>
                        <h3 className="font-bold text-qm-300 mb-3">Measured Features (6)</h3>
                        <ul className="space-y-2 text-slate-300">
                            <li>• Cognitive Connectivity (game)</li>
                            <li>• Memory Function (game)</li>
                            <li>• Sleep Quality (survey)</li>
                            <li>• Anxiety Level (voice)</li>
                            <li>• Social Isolation (voice)</li>
                            <li>• Substance/Diet/Academic (survey)</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-qm-300 mb-3">Estimated Features (8)</h3>
                        <ul className="space-y-2 text-slate-300">
                            <li>• Developmental Stage</li>
                            <li>• Family History</li>
                            <li>• Bullying Exposure</li>
                            <li>• Safety Perception</li>
                            <li>• Social Monitoring</li>
                            <li>• Physical Activity</li>
                            <li>• (Default: 0.5 neutral)</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-qm-300 mb-3">Quantum Processing</h3>
                        <ul className="space-y-2 text-slate-300">
                            <li>• 14 features → 14 qubits</li>
                            <li>• AngleEmbedding (Y-rotation)</li>
                            <li>• StronglyEntanglingLayers</li>
                            <li>• PauliZ measurement</li>
                            <li>• Risk probability output</li>
                            <li>• Depression probability derived</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
