import { Gamepad2, Mic, ClipboardList, Brain, Zap, Target, MemoryStick, Flame, Shield } from 'lucide-react';

const games = [
    {
        name: 'Neural Strike',
        icon: Target,
        description: 'Focus and attention assessment through target-based gameplay',
        color: 'from-blue-500 to-cyan-500',
        features: ['Measures cognitive connectivity', 'Tests sustained attention', 'Evaluates reaction time', 'Generates Feature 0'],
        mechanics: 'Click targets as they appear to test focus and attention span under time pressure'
    },
    {
        name: 'Reactor Sabotage',
        icon: Flame,
        description: 'Memory function evaluation through pattern recognition and recall',
        color: 'from-orange-500 to-red-500',
        features: ['Tests working memory', 'Pattern recognition', 'Hippocampal function assessment', 'Generates Feature 1'],
        mechanics: 'Remember and reproduce sequences to evaluate memory capacity and recall accuracy'
    },
    {
        name: 'Focus Game',
        icon: Zap,
        description: 'Concentration and sustained attention measurement',
        color: 'from-yellow-500 to-amber-500',
        features: ['Attention span tracking', 'Distraction resistance', 'Mental stamina evaluation'],
        mechanics: 'Maintain focus on a moving target while avoiding distractions'
    },
    {
        name: 'Memory Game',
        icon: MemoryStick,
        description: 'Classic memory matching for cognitive assessment',
        color: 'from-purple-500 to-pink-500',
        features: ['Short-term memory', 'Visual recognition', 'Cognitive processing speed'],
        mechanics: 'Match pairs of cards to test visual memory and pattern recognition'
    },
    {
        name: 'Neon Runner',
        icon: Shield,
        description: 'Reflex and decision-making under pressure',
        color: 'from-emerald-500 to-teal-500',
        features: ['Reaction time', 'Decision-making speed', 'Motor coordination'],
        mechanics: 'Navigate obstacles at increasing speeds to test reflexes and quick thinking'
    }
];

const dataModalities = [
    {
        title: 'Voice Analysis',
        icon: Mic,
        color: 'from-rose-500 to-red-500',
        description: 'Hume AI prosody detection for emotional state assessment',
        features: [
            'Real-time voice recording via browser',
            'Hume EVI (Empathic Voice Interface) integration',
            'Prosody analysis for anxiety markers',
            'Social isolation indicators from vocal patterns',
            'Generates Features 4 & 5: Anxiety Level, Social Isolation'
        ],
        technical: 'Uses Hume API with OAuth2 authentication, WebSocket connection for real-time analysis'
    },
    {
        title: 'Self-Report Survey',
        icon: ClipboardList,
        color: 'from-indigo-500 to-purple-500',
        description: 'Structured questionnaire for lifestyle and environmental factors',
        features: [
            'Sleep quality rating (1-10 scale)',
            'Substance use risk assessment',
            'Diet quality evaluation',
            'Academic pressure measurement',
            'Generates Features 2, 6, 7, 8'
        ],
        technical: 'React form with controlled inputs, validation, and normalization to 0-1 scale'
    },
    {
        title: 'Quantum Backend',
        icon: Brain,
        color: 'from-violet-500 to-fuchsia-500',
        description: '14-qubit Variational Quantum Classifier for risk prediction',
        features: [
            '14 features encoded as qubits via AngleEmbedding',
            'StronglyEntanglingLayers for feature interaction',
            '5 layers of quantum gates',
            'PauliZ measurement on qubit 0',
            'Risk probability: (Z + 1) / 2',
            'Depression probability derived from risk + anxiety + isolation'
        ],
        technical: 'PennyLane quantum ML framework, trained on Student Depression Dataset (2807 samples)'
    }
];

export default function AppFeatures() {
    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-qm-100 text-qm-700 rounded-full text-sm font-semibold mb-6">
                    <Gamepad2 className="w-4 h-4" />
                    Application Components
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                    App Features & Components
                </h1>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                    Quantum Mind combines cognitive games, voice biometrics, and self-reported data to create
                    a comprehensive mental health assessment powered by quantum machine learning.
                </p>
            </div>

            {/* Cognitive Games Section */}
            <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <Gamepad2 className="w-8 h-8 text-qm-600" />
                    Cognitive Assessment Games
                </h2>
                <p className="text-slate-600 mb-8 leading-relaxed">
                    Five interactive games designed to measure different aspects of cognitive function, focus, and memory.
                    The first two games (Neural Strike and Reactor Sabotage) directly contribute to the quantum feature vector.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    {games.map((game) => {
                        const Icon = game.icon;
                        return (
                            <div key={game.name} className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                <div className={`bg-gradient-to-br ${game.color} p-6 text-white`}>
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-2xl font-bold">{game.name}</h3>
                                    </div>
                                    <p className="text-white/90 text-sm">{game.description}</p>
                                </div>

                                <div className="p-6">
                                    <h4 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wide">Features</h4>
                                    <ul className="space-y-2 mb-6">
                                        {game.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                                <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${game.color} mt-1.5 flex-shrink-0`} />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                        <h5 className="font-semibold text-slate-700 text-xs mb-2">Game Mechanics</h5>
                                        <p className="text-xs text-slate-600 leading-relaxed">{game.mechanics}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Data Modalities Section */}
            <section>
                <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <Brain className="w-8 h-8 text-qm-600" />
                    Data Collection & Processing
                </h2>
                <p className="text-slate-600 mb-8 leading-relaxed">
                    Three primary data modalities work together to create a holistic mental health assessment:
                    voice biometrics, self-reported surveys, and quantum ML processing.
                </p>

                <div className="space-y-6">
                    {dataModalities.map((modality) => {
                        const Icon = modality.icon;
                        return (
                            <div key={modality.title} className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                                <div className="flex flex-col md:flex-row">
                                    {/* Left: Icon */}
                                    <div className={`bg-gradient-to-br ${modality.color} p-8 flex flex-col items-center justify-center text-white md:w-56`}>
                                        <Icon className="w-16 h-16 mb-4" />
                                        <h3 className="text-xl font-bold text-center">{modality.title}</h3>
                                    </div>

                                    {/* Right: Content */}
                                    <div className="flex-1 p-8">
                                        <p className="text-slate-600 mb-6 leading-relaxed">{modality.description}</p>

                                        <h4 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wide">Key Features</h4>
                                        <ul className="space-y-2 mb-6">
                                            {modality.features.map((feature, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${modality.color} mt-1.5 flex-shrink-0`} />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                            <h5 className="font-semibold text-slate-700 text-xs mb-2">Technical Implementation</h5>
                                            <p className="text-xs text-slate-600 leading-relaxed">{modality.technical}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Feature Summary */}
            <div className="bg-gradient-to-br from-qm-950 to-slate-900 rounded-2xl p-8 md:p-12 text-white">
                <h2 className="text-2xl font-bold mb-6">Complete Feature Vector (14 Features)</h2>
                <div className="grid md:grid-cols-2 gap-8 text-sm">
                    <div>
                        <h3 className="font-bold text-qm-300 mb-4">Directly Measured (6 features)</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                                <span className="text-slate-300">Feature 0: Cognitive Connectivity</span>
                                <span className="text-qm-400 font-mono text-xs">Neural Strike</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                                <span className="text-slate-300">Feature 1: Memory Function</span>
                                <span className="text-qm-400 font-mono text-xs">Reactor Sabotage</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                                <span className="text-slate-300">Feature 2: Sleep Quality</span>
                                <span className="text-qm-400 font-mono text-xs">Survey</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                                <span className="text-slate-300">Feature 4: Anxiety Level</span>
                                <span className="text-qm-400 font-mono text-xs">Voice (Hume)</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                                <span className="text-slate-300">Feature 5: Social Isolation</span>
                                <span className="text-qm-400 font-mono text-xs">Voice (Hume)</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                                <span className="text-slate-300">Features 6, 7, 8</span>
                                <span className="text-qm-400 font-mono text-xs">Survey</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-qm-300 mb-4">Estimated (8 features)</h3>
                        <div className="space-y-3">
                            {[
                                'Feature 3: Developmental Stage',
                                'Feature 9: Family History',
                                'Feature 10: Bullying Exposure',
                                'Feature 11: Safety Perception',
                                'Feature 12: Social Monitoring',
                                'Feature 13: Physical Activity'
                            ].map((feature, i) => (
                                <div key={i} className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                                    <span className="text-slate-300">{feature}</span>
                                    <span className="text-amber-400 font-mono text-xs">Default: 0.5</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                            These features use neutral default values (0.5) as they are not directly measured in the current implementation.
                            Future versions may incorporate additional data sources to measure these factors.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
