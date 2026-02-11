import { Database, ArrowRight, FileSpreadsheet, Shuffle, Binary } from 'lucide-react';

export default function DataPipeline() {
    const features = [
        { idx: 0, name: 'Connectivity', source: 'Focus Game', mapping: 'Stroop test accuracy × speed → 0-1', category: 'Neurocognitive', formula: 'accuracy × 0.7 + rtScore × 0.3' },
        { idx: 1, name: 'Memory', source: 'Memory Game', mapping: 'Pattern recall performance → 0-1', category: 'Neurocognitive', formula: 'correct_sequences / total_sequences' },
        { idx: 2, name: 'Sleep Quality', source: 'Survey + Voice', mapping: '"Less than 5h"→0.2, "5-6h"→0.5, "7-8h"→0.9, ">8h"→0.8', category: 'Lifestyle', formula: '(val - 1) / 4 (1-5 scale)' },
        { idx: 3, name: 'Developmental Stage', source: 'Estimated', mapping: 'Age normalized: (age - 12) / (30 - 12)', category: 'Demographic', formula: 'Default: 0.5' },
        { idx: 4, name: 'Anxiety Level', source: 'Hume Voice AI', mapping: 'Real-time prosody analysis → anxiety score', category: 'Emotional', formula: 'hume.anxiety (0-1 direct)' },
        { idx: 5, name: 'Social Isolation', source: 'Hume Voice AI', mapping: 'Sadness/withdrawal from voice patterns', category: 'Emotional', formula: 'hume.sadness (0-1 direct)' },
        { idx: 6, name: 'Substance Risk', source: 'Survey', mapping: 'Self-reported risk level 1-5 → 0-1', category: 'Behavioral', formula: '(val - 1) / 4' },
        { idx: 7, name: 'Diet Quality', source: 'Survey + Voice', mapping: '"Unhealthy"→0.2, "Moderate"→0.5, "Healthy"→0.9', category: 'Lifestyle', formula: '(val - 1) / 4' },
        { idx: 8, name: 'Academic Pressure', source: 'Survey + Voice', mapping: 'Self-reported pressure 1-5 → 0-1', category: 'Environmental', formula: '(val - 1) / 4' },
        { idx: 9, name: 'Family History', source: 'Estimated', mapping: 'Yes→0.8, No→0.2 + Gaussian noise', category: 'Genetic', formula: 'Default: 0.5' },
        { idx: 10, name: 'Bullying Exposure', source: 'Estimated', mapping: 'Random uniform [0.2, 0.8]', category: 'Environmental', formula: 'Default: 0.5' },
        { idx: 11, name: 'Safety Perception', source: 'Estimated', mapping: 'Random uniform [0.2, 0.8]', category: 'Environmental', formula: 'Default: 0.5' },
        { idx: 12, name: 'Social Monitoring', source: 'Estimated', mapping: 'Random uniform [0.2, 0.8]', category: 'Environmental', formula: 'Default: 0.5' },
        { idx: 13, name: 'Physical Activity', source: 'Estimated', mapping: 'Random uniform [0.2, 0.8]', category: 'Environmental', formula: 'Default: 0.5' },
    ];

    const sourceColors = {
        'Focus Game': 'blue',
        'Memory Game': 'blue',
        'Survey + Voice': 'green',
        'Survey': 'green',
        'Hume Voice AI': 'red',
        'Estimated': 'slate',
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 mb-2">Data Pipeline</h1>
                <p className="text-slate-600">From raw clinical data to 14-qubit Hilbert space — every transformation step explained.</p>
            </div>

            {/* Pipeline Overview */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Pipeline Overview</h2>
                <div className="flex flex-wrap items-center justify-center gap-3 text-sm mb-6">
                    {[
                        { label: 'Raw Dataset', desc: 'Student Depression Dataset', icon: FileSpreadsheet },
                        { label: 'Feature Engineering', desc: '14-variable mapping', icon: Shuffle },
                        { label: 'Normalization', desc: 'All values → [0, 1]', icon: ArrowRight },
                        { label: 'Quantum Encoding', desc: 'θ = x × π radians', icon: Binary },
                        { label: '14-Qubit State', desc: '|ψ⟩ in Hilbert space', icon: Database },
                    ].map((step, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center min-w-[120px]">
                                <step.icon className="w-5 h-5 text-qm-600 mx-auto mb-1" />
                                <div className="font-bold text-slate-800 text-xs">{step.label}</div>
                                <div className="text-xs text-slate-500">{step.desc}</div>
                            </div>
                            {i < 4 && <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Source Dataset */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Source Dataset</h2>
                <div className="text-sm text-slate-700 space-y-3">
                    <p>
                        The model is trained on the <strong>Student Depression Dataset</strong> (Kaggle), which contains survey data from university students including demographics, lifestyle habits, mental health indicators, and clinical labels.
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-slate-50 p-4 rounded-lg">
                            <div className="text-2xl font-black text-slate-900">27,871</div>
                            <div className="text-xs text-slate-600">Total samples</div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg">
                            <div className="text-2xl font-black text-slate-900">14</div>
                            <div className="text-xs text-slate-600">Engineered features</div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg">
                            <div className="text-2xl font-black text-slate-900">Binary</div>
                            <div className="text-xs text-slate-600">Risk label (0 or 1)</div>
                        </div>
                    </div>
                    <p>
                        <strong>Label Engineering:</strong> The risk label is not just the raw depression flag. It is an <em>entangled distress label</em> defined as:
                    </p>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 font-mono text-xs">
                        <div className="text-amber-900">Risk = 1 if:</div>
                        <div className="text-amber-800 ml-4">Depression == 1 (from source dataset)</div>
                        <div className="text-amber-800 ml-4">OR (Anxiety {'>'} 0.7 AND Connectivity {'<'} 0.5)</div>
                    </div>
                    <p className="text-slate-600">
                        This captures both explicit depression diagnoses AND implicit risk from the interaction of high anxiety with low cognitive function — a pattern that classical screening might miss.
                    </p>
                </div>
            </div>

            {/* 14-Feature Map */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6">14-Variable Hilbert Space Mapping</h2>
                <p className="text-sm text-slate-600 mb-4">Each feature occupies one qubit in the quantum circuit. Here is the complete mapping:</p>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left border-b-2 border-slate-200">
                                <th className="pb-3 pr-4 text-slate-500 font-semibold">Qubit</th>
                                <th className="pb-3 pr-4 text-slate-500 font-semibold">Feature</th>
                                <th className="pb-3 pr-4 text-slate-500 font-semibold">Source</th>
                                <th className="pb-3 pr-4 text-slate-500 font-semibold">Category</th>
                                <th className="pb-3 text-slate-500 font-semibold">Mapping</th>
                            </tr>
                        </thead>
                        <tbody>
                            {features.map((f) => {
                                const color = sourceColors[f.source] || 'slate';
                                return (
                                    <tr key={f.idx} className="border-b border-slate-100">
                                        <td className="py-3 pr-4 font-mono font-bold text-slate-400">{f.idx}</td>
                                        <td className="py-3 pr-4 font-bold text-slate-900">{f.name}</td>
                                        <td className="py-3 pr-4">
                                            <span className={`text-xs px-2 py-1 rounded-full bg-${color}-100 text-${color}-700 font-semibold`}>
                                                {f.source}
                                            </span>
                                        </td>
                                        <td className="py-3 pr-4 text-slate-600 text-xs">{f.category}</td>
                                        <td className="py-3 text-xs text-slate-600 font-mono">{f.mapping}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Entangled Features */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Derived (Entangled) Features</h2>
                <p className="text-sm text-slate-700 mb-4">
                    Two features are <strong>derived from other features</strong> during training data generation, mimicking how symptoms interact in real patients:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-bold text-blue-900 mb-2">Connectivity (Qubit 0)</h4>
                        <div className="font-mono text-xs text-blue-700 space-y-1">
                            <div>connectivity = 0.9</div>
                            <div>  - academic × 0.3</div>
                            <div>  - anxiety × 0.4</div>
                            <div>  - (1 - sleep) × 0.2</div>
                            <div>  + noise(0, 0.05)</div>
                        </div>
                        <p className="text-xs text-blue-800 mt-2">Models how academic pressure, anxiety, and poor sleep collectively degrade cognitive focus.</p>
                    </div>
                    <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
                        <h4 className="font-bold text-violet-900 mb-2">Memory Function (Qubit 1)</h4>
                        <div className="font-mono text-xs text-violet-700 space-y-1">
                            <div>memory = 0.8</div>
                            <div>  - diet × 0.2</div>
                            <div>  - depression × 0.4</div>
                            <div>  + noise(0, 0.05)</div>
                        </div>
                        <p className="text-xs text-violet-800 mt-2">Models how poor nutrition and depression impair hippocampal memory function.</p>
                    </div>
                </div>
            </div>

            {/* Normalization */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-900 text-white rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">Normalization: Why [0, 1]?</h2>
                <div className="text-sm text-slate-300 space-y-3">
                    <p>Every feature MUST be normalized to [0, 1] before quantum encoding because:</p>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                            <div className="font-bold text-white mb-1">Angle Range</div>
                            <p className="text-xs">θ = x × π maps [0,1] to [0, π]. Values outside this range would wrap around the Bloch sphere unpredictably.</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                            <div className="font-bold text-white mb-1">Equal Influence</div>
                            <p className="text-xs">Without normalization, features with larger scales would dominate the quantum state. Equal scaling ensures fair contribution.</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                            <div className="font-bold text-white mb-1">Gradient Stability</div>
                            <p className="text-xs">Bounded inputs prevent vanishing/exploding gradients during training, helping the Adam optimizer converge smoothly.</p>
                        </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 font-mono text-xs">
                        <div className="text-green-300">Survey: (val - 1) / 4  →  1→0.0, 3→0.5, 5→1.0</div>
                        <div className="text-green-300">Age: (age - 12) / 18  →  12→0.0, 21→0.5, 30→1.0</div>
                        <div className="text-green-300">Hume: direct 0-1 scores from API</div>
                        <div className="text-green-300">Games: performance score already 0-1</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
