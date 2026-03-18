import { Gamepad2, Mic, ClipboardList, Brain, Zap, Target, MemoryStick, Flame, Shield } from 'lucide-react';

const games = [
    {
        name: 'Neural Strike',
        icon: Target,
        description: 'Focus and attention assessment through target-based gameplay',
        features: ['Measures cognitive connectivity', 'Tests sustained attention', 'Evaluates reaction time', 'Generates Feature 0'],
        mechanics: 'Click targets as they appear to test focus and attention span under time pressure'
    },
    {
        name: 'Reactor Sabotage',
        icon: Flame,
        description: 'Memory function evaluation through pattern recognition and recall',
        features: ['Tests working memory', 'Pattern recognition', 'Hippocampal function assessment', 'Generates Feature 1'],
        mechanics: 'Remember and reproduce sequences to evaluate memory capacity and recall accuracy'
    },
    {
        name: 'Focus Game',
        icon: Zap,
        description: 'Concentration and sustained attention measurement',
        features: ['Attention span tracking', 'Distraction resistance', 'Mental stamina evaluation'],
        mechanics: 'Maintain focus on a moving target while avoiding distractions'
    },
    {
        name: 'Memory Game',
        icon: MemoryStick,
        description: 'Classic memory matching for cognitive assessment',
        features: ['Short-term memory', 'Visual recognition', 'Cognitive processing speed'],
        mechanics: 'Match pairs of cards to test visual memory and pattern recognition'
    },
    {
        name: 'Neon Runner',
        icon: Shield,
        description: 'Reflex and decision-making under pressure',
        features: ['Reaction time', 'Decision-making speed', 'Motor coordination'],
        mechanics: 'Navigate obstacles at increasing speeds to test reflexes and quick thinking'
    }
];

const dataModalities = [
    {
        title: 'Voice Analysis',
        icon: Mic,
        description: 'Hume AI prosody detection for emotional state assessment',
        features: [
            'Real-time voice recording via browser',
            'Hume EVI integration',
            'Prosody analysis for anxiety markers',
            'Social isolation indicators',
            'Generates Features 4 & 5'
        ],
        technical: 'Uses Hume API with OAuth2 authentication, WebSocket connection'
    },
    {
        title: 'Self-Report Survey',
        icon: ClipboardList,
        description: 'Structured questionnaire for lifestyle and environmental factors',
        features: [
            'Sleep quality rating (1-10)',
            'Substance use risk assessment',
            'Diet quality evaluation',
            'Academic pressure measurement',
            'Generates Features 2, 6, 7, 8'
        ],
        technical: 'React form with validation, normalization to 0-1 scale'
    },
    {
        title: 'Quantum Backend',
        icon: Brain,
        description: '14-qubit Variational Quantum Classifier for risk prediction',
        features: [
            '14 features encoded via AngleEmbedding',
            'StronglyEntanglingLayers interactions',
            '5 layers of quantum gates',
            'PauliZ measurement on qubit 0',
            'Risk probability output',
            'Depression probability derivation'
        ],
        technical: 'PennyLane quantum ML framework, trained on 2,807 samples'
    }
];

export default function AcademicAppFeatures() {
    return (
        <div className="font-serif max-w-5xl mx-auto space-y-12 pb-20 print:space-y-8 print:pb-0">
            {/* Header */}
            <div className="border-b-2 border-black pb-4">
                <h1 className="text-3xl font-bold text-black uppercase tracking-wide">
                    Application Components & Features
                </h1>
                <p className="text-gray-700 italic mt-1">
                    Technical Specifications of Cognitive Games and Data Collection Modules
                </p>
            </div>

            {/* Cognitive Games Table */}
            <section>
                <h2 className="text-lg font-bold text-black uppercase border-b border-gray-400 mb-4 pb-1">
                    1. Cognitive Assessment Games
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse border border-black">
                        <thead className="bg-gray-100 text-black border-b border-black">
                            <tr>
                                <th className="border-r border-black px-4 py-2 w-1/6">Game Module</th>
                                <th className="border-r border-black px-4 py-2 w-1/4">Primary Objective</th>
                                <th className="border-r border-black px-4 py-2">Key Metrics & Features</th>
                                <th className="px-4 py-2">Mechanics</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-300">
                            {games.map((game) => (
                                <tr key={game.name}>
                                    <td className="border-r border-black px-4 py-2 font-bold">{game.name}</td>
                                    <td className="border-r border-black px-4 py-2">{game.description}</td>
                                    <td className="border-r border-black px-4 py-2">
                                        <ul className="list-disc list-inside">
                                            {game.features.map((f, i) => <li key={i}>{f}</li>)}
                                        </ul>
                                    </td>
                                    <td className="px-4 py-2 italic">{game.mechanics}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Data Modalities Table */}
            <section>
                <h2 className="text-lg font-bold text-black uppercase border-b border-gray-400 mb-4 pb-1">
                    2. Data Collection System
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse border border-black">
                        <thead className="bg-gray-100 text-black border-b border-black">
                            <tr>
                                <th className="border-r border-black px-4 py-2 w-1/6">Modality</th>
                                <th className="border-r border-black px-4 py-2 w-1/4">Description</th>
                                <th className="border-r border-black px-4 py-2">Captured Features</th>
                                <th className="px-4 py-2">Technical Implementation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-300">
                            {dataModalities.map((item) => (
                                <tr key={item.title}>
                                    <td className="border-r border-black px-4 py-2 font-bold">{item.title}</td>
                                    <td className="border-r border-black px-4 py-2">{item.description}</td>
                                    <td className="border-r border-black px-4 py-2">
                                        <ul className="list-disc list-inside">
                                            {item.features.map((f, i) => <li key={i}>{f}</li>)}
                                        </ul>
                                    </td>
                                    <td className="px-4 py-2 font-mono text-xs">{item.technical}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Footer */}
            <div className="border-t border-black pt-4 text-xs text-center font-mono mt-12">
                Quantum Mind Technical Documentation | Generated {new Date().toLocaleDateString()}
            </div>
        </div>
    );
}
