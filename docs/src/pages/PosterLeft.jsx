import { Atom, Brain, AlertTriangle, Target, FlaskConical, Cpu, List } from 'lucide-react';

export default function PosterLeft() {
    return (
        <div className="poster-panel space-y-8">
            {/* Panel Header */}
            <div className="text-center border-b-2 border-qm-200 pb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-qm-100 text-qm-700 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                    <Atom className="w-3 h-3" /> Poster — Left Panel
                </div>
                <h1 className="text-2xl font-black text-slate-900">Background &amp; Methods</h1>
            </div>

            {/* ── INTRODUCTION ── */}
            <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
                <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
                    <Brain className="w-5 h-5 text-qm-400" /> Introduction
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed mb-3">
                    Mental health disorders are the leading cause of disability among young people worldwide.
                    According to the WHO, <strong className="text-white">1 in 7 adolescents</strong> experiences a mental health condition,
                    yet fewer than <strong className="text-white">36%</strong> receive timely screening or treatment.
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">
                    Traditional clinical assessments rely on lengthy in-person evaluations that most students
                    never access. By the time intervention occurs, students may already be in crisis.
                    <strong className="text-white"> There is an urgent need for scalable, accessible, and accurate early screening tools.</strong>
                </p>
            </section>

            {/* ── PROBLEM STATEMENT ── */}
            <section className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <h2 className="flex items-center gap-2 text-lg font-bold text-red-900 mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-500" /> Problem Statement
                </h2>
                <ul className="space-y-3 text-sm text-red-900">
                    {[
                        'Current mental health screening is reactive, not proactive — students are identified only after reaching crisis.',
                        'Clinical questionnaires suffer from response bias and cannot capture the multidimensional, entangled nature of mental health.',
                        'Classical machine learning models treat features independently, missing the complex non-linear correlations between sleep, cognition, social behavior, and emotional state.',
                        'There is no widely available smartphone-integrated screening tool that leverages quantum computing for mental health triage.',
                    ].map((point, i) => (
                        <li key={i} className="flex gap-3">
                            <span className="text-red-400 font-black text-base leading-5">{i + 1}.</span>
                            <span className="leading-relaxed">{point}</span>
                        </li>
                    ))}
                </ul>
            </section>

            {/* ── ENGINEERING GOALS ── */}
            <section className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <h2 className="flex items-center gap-2 text-lg font-bold text-blue-900 mb-4">
                    <Target className="w-5 h-5 text-blue-500" /> Engineering Goals
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-sm">
                        <div className="font-bold text-blue-800 text-sm mb-1">1. Accessibility</div>
                        <p className="text-xs text-slate-600">
                            Mobile-first React design ensures students can access screening on any device, overcoming geographic and economic barriers to care.
                        </p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-sm">
                        <div className="font-bold text-blue-800 text-sm mb-1">2. Scalability</div>
                        <p className="text-xs text-slate-600">
                            Containerized Docker architecture on Cloud Run allows the system to handle thousands of concurrent users with auto-scaling.
                        </p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-sm">
                        <div className="font-bold text-blue-800 text-sm mb-1">3. Quantum Integration</div>
                        <p className="text-xs text-slate-600">
                            Seamless hybrid workflow: Classical frontend ↔ Python/FastAPI backend ↔ PennyLane Quantum Circuit.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── RESEARCH QUESTION & HYPOTHESIS ── */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6">
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">
                    <Target className="w-5 h-5 text-qm-500" /> Research Question &amp; Hypothesis
                </h2>
                <div className="bg-qm-50 rounded-xl p-4 mb-4 border border-qm-200">
                    <p className="text-sm font-semibold text-qm-800 italic">
                        "Can a hybrid quantum-classical machine learning system, utilizing a Variational Quantum Classifier
                        on smartphone-collected psychometric and biometric data, provide accurate early-stage mental health
                        risk triage for students?"
                    </p>
                </div>
                <div className="space-y-3 text-sm text-slate-700">
                    <div>
                        <span className="font-bold text-slate-900">Hypothesis:</span> A Variational Quantum Classifier (VQC) can
                        leverage quantum entanglement to model the complex, interdependent relationships between 14 mental health
                        indicators and produce accurate risk classifications with an F1 score exceeding 0.75.
                    </div>
                    <div>
                        <span className="font-bold text-slate-900">Null Hypothesis (H₀):</span> The VQC will perform no better
                        than random classification (AUC-ROC ≤ 0.5) on the mental health triage task.
                    </div>
                </div>
            </section>

            {/* ── MATERIALS & METHODS ── */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6">
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">
                    <FlaskConical className="w-5 h-5 text-emerald-500" /> Materials &amp; Methods
                </h2>

                <h3 className="font-bold text-sm text-slate-800 mb-2 mt-2">Data Collection</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    Synthetic clinical profiles were derived from the <em>Student Depression Dataset</em> (27,870 student records),
                    mapping raw survey responses to 14 normalized biometric and psychometric features in the range [0, 1].
                    A stratified 80/20 train-test split with seed 42 ensured reproducibility.
                </p>

                <h3 className="font-bold text-sm text-slate-800 mb-2">Three Data Modalities</h3>
                <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                        { title: 'Cognitive Games', desc: 'Connectivity & memory tasks measuring hippocampal function, focus, and working memory', color: 'blue' },
                        { title: 'Voice Analysis', desc: 'Hume AI prosody analysis for anxiety, isolation, and emotional state markers', color: 'violet' },
                        { title: 'Self-Report', desc: 'PHQ-9 inspired survey for sleep, diet, substance use, academic pressure, and safety', color: 'emerald' },
                    ].map((mod, i) => (
                        <div key={i} className={`bg-${mod.color}-50 border border-${mod.color}-200 rounded-xl p-3`}>
                            <div className={`text-xs font-bold text-${mod.color}-700 uppercase tracking-wider mb-1`}>{mod.title}</div>
                            <div className="text-xs text-slate-600 leading-relaxed">{mod.desc}</div>
                        </div>
                    ))}
                </div>

                <h3 className="font-bold text-sm text-slate-800 mb-2">The Science of Voice (Hume AI)</h3>
                <div className="bg-violet-50 border border-violet-100 rounded-xl p-4 mb-4">
                    <div className="flex gap-4 items-start">
                        <div className="flex-1">
                            <p className="text-xs text-slate-700 leading-relaxed mb-2">
                                <strong>Why Voice?</strong> Vocal prosody (rhythm, pitch, tone) contains rich biomarkers for mental health.
                                Studies show that flattened affect, increased pauses, and specific frequency shifts are strong indicators of depression.
                            </p>
                            <p className="text-xs text-slate-700 leading-relaxed">
                                <strong>How it Works:</strong> We utilize Hume AI's EVI (Empathic Voice Interface) to extract
                                high-dimensional emotional feature vectors from user audio samples. We specifically map
                                <em> "Anxiety," "Sadness,"</em> and <em>"Tiredness"</em> scores to our feature space.
                            </p>
                        </div>
                        <div className="w-1/3 bg-white rounded-lg border border-violet-200 p-2 text-center">
                            <div className="text-[10px] font-bold text-violet-500 uppercase mb-1">Audio Processing Pipeline</div>
                            <div className="space-y-1">
                                <div className="text-[10px] bg-slate-100 rounded py-1">Raw Audio Input</div>
                                <div className="text-[8px] text-slate-400">↓</div>
                                <div className="text-[10px] bg-violet-100 text-violet-700 rounded py-1 font-bold">Hume AI Model</div>
                                <div className="text-[8px] text-slate-400">↓</div>
                                <div className="text-[10px] bg-emerald-100 text-emerald-700 rounded py-1 font-bold">Emotion Vectors</div>
                            </div>
                        </div>
                    </div>
                </div>

                <h3 className="font-bold text-sm text-slate-800 mb-2">14-Qubit Feature Space</h3>
                <div className="grid grid-cols-2 gap-1.5 text-xs mb-4">
                    {[
                        { q: 0, name: 'Connectivity (Focus)', src: 'Game' },
                        { q: 1, name: 'Hippocampal (Memory)', src: 'Game' },
                        { q: 2, name: 'Sleep Quality', src: 'Survey' },
                        { q: 3, name: 'Developmental Stage', src: 'Survey' },
                        { q: 4, name: 'Anxiety Level', src: 'Hume AI' },
                        { q: 5, name: 'Social Isolation', src: 'Hume AI' },
                        { q: 6, name: 'Substance Risk', src: 'Survey' },
                        { q: 7, name: 'Diet Quality', src: 'Survey' },
                        { q: 8, name: 'Academic Pressure', src: 'Survey' },
                        { q: 9, name: 'Family Conflict', src: 'Survey' },
                        { q: 10, name: 'Bullying Exposure', src: 'Survey' },
                        { q: 11, name: 'Safety Perception', src: 'Survey' },
                        { q: 12, name: 'Parental Monitoring', src: 'Survey' },
                        { q: 13, name: 'Exercise Habits', src: 'Survey' },
                    ].map(f => (
                        <div key={f.q} className="flex items-center gap-2 bg-slate-50 rounded-lg px-2 py-1.5 border border-slate-200">
                            <span className="w-5 h-5 bg-qm-600 text-white rounded flex items-center justify-center font-bold text-[10px]">{f.q}</span>
                            <div>
                                <span className="font-semibold text-slate-800">{f.name}</span>
                                <span className="ml-1 text-slate-400">({f.src})</span>
                            </div>
                        </div>
                    ))}
                </div>

                <h3 className="font-bold text-sm text-slate-800 mb-2">Quantum Model Architecture</h3>
                <div className="bg-slate-900 text-slate-300 rounded-xl p-4 text-xs font-mono leading-relaxed">
                    <div className="text-qm-400 mb-1">## Variational Quantum Classifier (VQC)</div>
                    <div>Qubits:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14</div>
                    <div>Variational Layers: StronglyEntanglingLayers</div>
                    <div>Data Encoding:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AngleEmbedding (Y-rotation × π)</div>
                    <div>Measurement:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⟨PauliZ₀⟩ → sigmoid → P(risk)</div>
                    <div>Optimizer:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Adam (lr configurable)</div>
                    <div>Loss:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Mean Squared Error</div>
                    <div>Framework:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PennyLane + default.qubit</div>
                </div>
            </section>

            {/* ── PROCEDURE ── */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6">
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">
                    <List className="w-5 h-5 text-amber-500" /> Experimental Procedure
                </h2>
                <ol className="space-y-3 text-sm text-slate-700">
                    {[
                        'Collect and preprocess Student Depression Dataset (27,870 records).',
                        'Extract and normalize 14 psychometric and biometric features to [0, 1] range.',
                        'Map features to qubit rotations via AngleEmbedding (x × π radians, Y-axis).',
                        'Initialize VQC with random weights; apply StronglyEntanglingLayers for qubit entanglement.',
                        'Train the quantum circuit with Adam optimizer, minimizing MSE loss over mini-batches.',
                        'Evaluate on held-out 20% test set; compute accuracy, precision, recall, F1, AUC-ROC, MCC.',
                        'Compare train vs. test metrics to assess overfitting.',
                        'Compute permutation-based feature importance to identify key risk factors.',
                        'Deploy as a Dockerized FastAPI + React web application for real-time triage.',
                    ].map((step, i) => (
                        <li key={i} className="flex gap-3">
                            <span className="w-6 h-6 bg-qm-100 text-qm-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                            <span className="leading-relaxed">{step}</span>
                        </li>
                    ))}
                </ol>
            </section>
        </div>
    );
}
