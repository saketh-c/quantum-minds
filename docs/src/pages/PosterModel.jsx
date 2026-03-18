import { Atom, Brain, Mic, ClipboardList, Layers, ArrowRight, Cpu, Zap, GitBranch, Radio, Workflow, Sparkles, AudioLines, FileText, Activity } from 'lucide-react';
import evalData from '../data/evaluationResults.json';

const cfg = evalData?.model_config ?? {};

export default function PosterModel() {
    return (
        <div className="poster-panel space-y-8">
            {/* Panel Header */}
            <div className="text-center border-b-2 border-qm-200 pb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-qm-100 text-qm-700 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                    <Cpu className="w-3 h-3" /> Poster — Model Deep Dive
                </div>
                <h1 className="text-2xl font-black text-slate-900">Model Architecture &amp; Data Pipeline</h1>
                <p className="text-sm text-slate-500 mt-2">How we collect data, process it, and run it through a quantum circuit</p>
            </div>

            {/* ── END-TO-END PIPELINE ── */}
            <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
                <h2 className="flex items-center gap-2 text-lg font-bold mb-5">
                    <Workflow className="w-5 h-5 text-qm-400" /> End-to-End Data Pipeline
                </h2>
                <div className="grid grid-cols-5 gap-2 items-center">
                    {[
                        { icon: Mic, label: 'Voice\nCapture', sub: 'Hume AI EVI', color: 'violet' },
                        { icon: ClipboardList, label: 'Survey\nInput', sub: '3 Questions', color: 'emerald' },
                        { icon: Activity, label: 'Feature\nExtraction', sub: '14 Features', color: 'blue' },
                        { icon: Atom, label: 'Quantum\nCircuit', sub: '14-Qubit VQC', color: 'qm' },
                        { icon: Brain, label: 'Risk\nPrediction', sub: 'Triage Report', color: 'rose' },
                    ].map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <div key={i} className="text-center">
                                <div className={`w-12 h-12 mx-auto bg-${step.color}-500/20 border border-${step.color}-400/40 rounded-xl flex items-center justify-center mb-2`}>
                                    <Icon className={`w-5 h-5 text-${step.color}-400`} />
                                </div>
                                <div className="text-[11px] font-bold text-white leading-tight whitespace-pre-line">{step.label}</div>
                                <div className="text-[9px] text-slate-400 mt-0.5">{step.sub}</div>
                                {i < 4 && (
                                    <div className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2">
                                        <ArrowRight className="w-3 h-3 text-slate-500" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="flex items-center justify-center gap-1 mt-4">
                    {[0,1,2,3].map(i => (
                        <div key={i} className="flex items-center gap-1">
                            <div className="w-8 h-0.5 bg-slate-600 rounded" />
                            <ArrowRight className="w-3 h-3 text-slate-500" />
                        </div>
                    ))}
                </div>
                <p className="text-xs text-slate-400 text-center mt-3 italic">
                    Data flows from multimodal inputs → normalized features → quantum circuit → holistic risk assessment
                </p>
            </section>

            {/* ── HUME AI VOICE ANALYSIS ── */}
            <section className="bg-violet-50 border border-violet-200 rounded-2xl p-6">
                <h2 className="flex items-center gap-2 text-lg font-bold text-violet-900 mb-4">
                    <Mic className="w-5 h-5 text-violet-500" /> Hume AI Voice Prosody Analysis
                </h2>
                <p className="text-sm text-violet-800 leading-relaxed mb-4">
                    Our system integrates <strong>Hume AI's Empathic Voice Interface (EVI)</strong> — a state-of-the-art
                    voice analysis platform that measures emotional expression from speech patterns in real time.
                    This captures what traditional surveys cannot: the <em>way</em> a student speaks, not just what they say.
                </p>

                <h3 className="font-bold text-sm text-violet-900 mb-2">How It Works</h3>
                <div className="space-y-3 mb-5">
                    {[
                        {
                            step: '1',
                            icon: Radio,
                            title: 'Audio Capture',
                            desc: 'The browser captures microphone audio via the Web Audio API (ScriptProcessorNode). Raw Float32 samples are converted to 16-bit PCM and base64-encoded.',
                        },
                        {
                            step: '2',
                            icon: AudioLines,
                            title: 'Real-Time Prosody Streaming',
                            desc: 'Audio chunks are streamed to Hume\'s WebSocket endpoint (wss://api.hume.ai/v0/evi/chat) using an ephemeral OAuth2 access token obtained from our backend. Hume analyzes pitch, tone, rhythm, and vocal quality.',
                        },
                        {
                            step: '3',
                            icon: Sparkles,
                            title: 'Emotion Score Extraction',
                            desc: 'Hume returns real-time emotion probabilities for 48+ emotion categories. We extract key markers: anxiety indicators (nervousness, tension, worry) and social isolation indicators (sadness, distress, withdrawal).',
                        },
                        {
                            step: '4',
                            icon: FileText,
                            title: 'Transcript Analysis (Together AI)',
                            desc: 'Simultaneously, browser-based speech recognition captures what the student says. The transcript is sent to Meta Llama 3.1 (via Together AI) to extract explicit self-reported ratings for sleep, anxiety, academic pressure, diet, and social activity.',
                        },
                        {
                            step: '5',
                            icon: GitBranch,
                            title: 'Feature Fusion',
                            desc: 'Prosody-derived scores (anxiety, isolation) and transcript-extracted ratings are combined with survey inputs. The fused data maps to 14 normalized features [0, 1] that feed the quantum circuit.',
                        },
                    ].map(item => {
                        const Icon = item.icon;
                        return (
                            <div key={item.step} className="flex gap-3">
                                <div className="w-8 h-8 bg-violet-200 border border-violet-300 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Icon className="w-4 h-4 text-violet-600" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-violet-900">{item.title}</div>
                                    <div className="text-xs text-violet-700 leading-relaxed">{item.desc}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="bg-violet-100 rounded-xl p-4 border border-violet-300">
                    <h4 className="text-xs font-bold text-violet-800 uppercase tracking-wider mb-2">Voice-Derived Features (Qubits 4 & 5)</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-lg p-3 border border-violet-200">
                            <div className="text-xs font-bold text-violet-700 mb-1">Qubit 4 — Anxiety Level</div>
                            <div className="text-[11px] text-slate-600 leading-relaxed">
                                Derived from Hume prosody scores for <em>nervousness</em>, <em>tension</em>, and <em>worry</em>.
                                High pitch variability and fast speaking rate correlate with elevated anxiety.
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-violet-200">
                            <div className="text-xs font-bold text-violet-700 mb-1">Qubit 5 — Social Isolation</div>
                            <div className="text-[11px] text-slate-600 leading-relaxed">
                                Derived from Hume prosody scores for <em>sadness</em>, <em>distress</em>, and vocal monotonicity.
                                Flat affect and low vocal energy are indicators of social withdrawal.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SURVEY QUESTIONS ── */}
            <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
                <h2 className="flex items-center gap-2 text-lg font-bold text-emerald-900 mb-4">
                    <ClipboardList className="w-5 h-5 text-emerald-500" /> Survey Questions &amp; Feature Mapping
                </h2>
                <p className="text-sm text-emerald-800 leading-relaxed mb-4">
                    Students answer <strong>three focused questions</strong> on a 1–5 scale while speaking aloud.
                    The voice analysis runs simultaneously, so we capture both <em>explicit responses</em> and <em>implicit emotional signals</em>.
                </p>

                <div className="space-y-3 mb-5">
                    {[
                        {
                            question: 'Sleep Quality',
                            scale: '1 = Poor → 5 = Excellent',
                            qubit: 2,
                            color: 'green',
                            detail: 'Maps to Qubit 2. Normalized: (rating - 1) / 4 → [0, 1]. Sleep quality is among the strongest predictors of adolescent depression in clinical literature.',
                        },
                        {
                            question: 'Academic Pressure',
                            scale: '1 = None → 5 = Overwhelming',
                            qubit: 8,
                            color: 'yellow',
                            detail: 'Maps to Qubit 8. Higher values indicate greater perceived academic stress. This feature showed high importance in our permutation analysis.',
                        },
                        {
                            question: 'Diet Quality',
                            scale: '1 = Unhealthy → 5 = Healthy',
                            qubit: 7,
                            color: 'blue',
                            detail: 'Maps to Qubit 7. Nutritional patterns are correlated with mental health outcomes. Poor diet is associated with increased depressive symptoms in youth.',
                        },
                    ].map(q => (
                        <div key={q.qubit} className={`bg-white rounded-xl p-4 border border-${q.color}-200`}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 bg-qm-600 text-white rounded flex items-center justify-center font-bold text-[10px]">Q{q.qubit}</span>
                                    <span className="text-sm font-bold text-slate-900">{q.question}</span>
                                </div>
                                <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{q.scale}</span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">{q.detail}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-emerald-100 rounded-xl p-4 border border-emerald-300">
                    <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">Additional Estimated Features</h4>
                    <p className="text-xs text-emerald-700 leading-relaxed mb-2">
                        The remaining features (Qubits 0–1, 3, 6, 9–13) are derived from cognitive game performance, demographic data,
                        and estimated from correlational models. In our synthetic dataset, these are generated using realistic
                        distributional patterns from the Student Depression Dataset.
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {[
                            'Q0: Cognitive Focus', 'Q1: Memory', 'Q3: Dev. Stage', 'Q6: Substance Risk',
                            'Q9: Family History', 'Q10: Bullying', 'Q11: Safety', 'Q12: Social Monitor', 'Q13: Exercise',
                        ].map(f => (
                            <span key={f} className="text-[10px] bg-white border border-emerald-200 text-emerald-700 px-2 py-1 rounded-md font-mono">{f}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── QUANTUM CIRCUIT ARCHITECTURE ── */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6">
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">
                    <Atom className="w-5 h-5 text-qm-500" /> Quantum Circuit Architecture
                </h2>

                {/* Visual circuit diagram */}
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 mb-5 overflow-x-auto">
                    <div className="text-xs font-mono text-slate-500 mb-3 text-center">14-Qubit Variational Quantum Classifier</div>
                    <div className="space-y-1 min-w-[500px]">
                        {Array.from({ length: 14 }, (_, i) => (
                            <div key={i} className="flex items-center gap-0 text-[10px] font-mono">
                                <span className="w-10 text-right text-slate-400 pr-2">q[{i}]</span>
                                <span className="text-slate-300">|0⟩──</span>
                                <span className="bg-blue-100 border border-blue-300 text-blue-700 px-1.5 py-0.5 rounded text-[9px] font-bold">Ry(x{i}·π)</span>
                                <span className="text-slate-300">──</span>
                                {Array.from({ length: cfg.layers || 4 }, (_, l) => (
                                    <span key={l} className="flex items-center gap-0">
                                        <span className="bg-violet-100 border border-violet-300 text-violet-700 px-1 py-0.5 rounded text-[9px]">SEL{l+1}</span>
                                        <span className="text-slate-300">{l < (cfg.layers || 4) - 1 ? '──' : ''}</span>
                                    </span>
                                ))}
                                <span className="text-slate-300">──</span>
                                {i === 0 ? (
                                    <span className="bg-rose-100 border border-rose-300 text-rose-700 px-1.5 py-0.5 rounded text-[9px] font-bold">⟨Z⟩</span>
                                ) : (
                                    <span className="text-slate-200">────</span>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-center gap-6 mt-4 text-[10px]">
                        <div className="flex items-center gap-1">
                            <span className="w-3 h-3 bg-blue-100 border border-blue-300 rounded" />
                            <span className="text-slate-500">AngleEmbedding</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-3 h-3 bg-violet-100 border border-violet-300 rounded" />
                            <span className="text-slate-500">StronglyEntanglingLayers</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-3 h-3 bg-rose-100 border border-rose-300 rounded" />
                            <span className="text-slate-500">PauliZ Measurement</span>
                        </div>
                    </div>
                </div>

                {/* Model config stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    {[
                        { label: 'Qubits', value: cfg.qubits || 14, sub: 'One per feature' },
                        { label: 'Layers', value: cfg.layers || 4, sub: 'Entangling depth' },
                        { label: 'Parameters', value: (cfg.layers || 4) * 14 * 3, sub: 'Trainable weights' },
                        { label: 'Training Steps', value: cfg.training_steps || 500, sub: 'Adam optimizer' },
                    ].map(s => (
                        <div key={s.label} className="bg-qm-50 rounded-xl p-3 text-center border border-qm-200">
                            <div className="text-2xl font-black text-qm-700">{s.value}</div>
                            <div className="text-xs font-bold text-qm-600">{s.label}</div>
                            <div className="text-[10px] text-qm-400">{s.sub}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── LAYER-BY-LAYER BREAKDOWN ── */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6">
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">
                    <Layers className="w-5 h-5 text-blue-500" /> Layer-by-Layer Breakdown
                </h2>

                <div className="space-y-4">
                    {/* Layer 1: AngleEmbedding */}
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">1</span>
                            <span className="font-bold text-sm text-blue-900">AngleEmbedding — Data Encoding</span>
                        </div>
                        <div className="text-xs text-blue-800 leading-relaxed mb-3">
                            Each of the 14 input features is encoded onto its own qubit as a rotation angle.
                            Feature values are in [0, 1] and are multiplied by π to create rotation angles in [0, π].
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-blue-200 font-mono text-xs text-blue-700">
                            <div className="mb-1">for each qubit <em>i</em> ∈ [0, 13]:</div>
                            <div className="ml-4">|0⟩ → R<sub>y</sub>(x<sub>i</sub> · π) |ψ<sub>i</sub>⟩</div>
                            <div className="mt-2 text-[10px] text-slate-500 font-sans">
                                A feature value of 0 leaves the qubit at |0⟩; a value of 1 rotates it to |1⟩.
                                Values between 0 and 1 create superposition states — this is the quantum advantage.
                            </div>
                        </div>
                    </div>

                    {/* Layer 2: StronglyEntanglingLayers */}
                    <div className="bg-violet-50 rounded-xl p-4 border border-violet-200">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-6 h-6 bg-violet-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">2</span>
                            <span className="font-bold text-sm text-violet-900">StronglyEntanglingLayers — Quantum Processing</span>
                        </div>
                        <div className="text-xs text-violet-800 leading-relaxed mb-3">
                            This is where the quantum magic happens. Each layer applies three operations to every qubit,
                            then entangles all qubits with their neighbors using CNOT gates. We use <strong>{cfg.layers || 4} layers</strong>,
                            giving the circuit {(cfg.layers || 4) * 14 * 3} trainable parameters.
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                            {[
                                {
                                    title: 'Single-Qubit Rotations',
                                    desc: 'Each qubit receives 3 rotation gates (Rx, Ry, Rz) with trainable angles. These transform the qubit state in the Bloch sphere.',
                                    formula: 'R(θ₁, θ₂, θ₃) = Rz(θ₃)·Ry(θ₂)·Rx(θ₁)',
                                },
                                {
                                    title: 'CNOT Entanglement',
                                    desc: 'Controlled-NOT gates connect each qubit to the next, creating quantum correlations. This models how features interact (e.g., sleep affects cognition).',
                                    formula: 'CNOT(qᵢ, qᵢ₊₁) for all i',
                                },
                                {
                                    title: 'Layer Repetition',
                                    desc: `With ${cfg.layers || 4} layers, the circuit applies this pattern ${cfg.layers || 4} times with different angles, increasing the expressiveness and learning capacity.`,
                                    formula: `depth = ${cfg.layers || 4} layers × 14 qubits`,
                                },
                            ].map(item => (
                                <div key={item.title} className="bg-white rounded-lg p-3 border border-violet-200">
                                    <div className="text-[11px] font-bold text-violet-700 mb-1">{item.title}</div>
                                    <div className="text-[10px] text-slate-600 leading-relaxed mb-2">{item.desc}</div>
                                    <div className="text-[9px] font-mono text-violet-500 bg-violet-50 px-2 py-1 rounded">{item.formula}</div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-violet-100 rounded-lg p-3 border border-violet-300">
                            <div className="text-[10px] font-bold text-violet-800 mb-1">Why "Strongly Entangling"?</div>
                            <div className="text-[10px] text-violet-700 leading-relaxed">
                                Unlike basic entangling circuits, <code className="text-[9px] bg-white px-1 rounded">StronglyEntanglingLayers</code> uses
                                a different entanglement pattern in each layer — first connecting qubit 0→1, 1→2, ..., then
                                using different strides. This ensures <strong>every qubit becomes correlated with every other qubit</strong> after
                                just a few layers. For mental health, this means the model can learn that a combination of poor sleep (Q2),
                                high anxiety (Q4), and social isolation (Q5) together produce a different risk than any single factor alone.
                            </div>
                        </div>
                    </div>

                    {/* Layer 3: Measurement */}
                    <div className="bg-rose-50 rounded-xl p-4 border border-rose-200">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">3</span>
                            <span className="font-bold text-sm text-rose-900">PauliZ Measurement — Classification Output</span>
                        </div>
                        <div className="text-xs text-rose-800 leading-relaxed mb-3">
                            After processing through all variational layers, we measure the <strong>expectation value of the Pauli-Z
                            operator on qubit 0</strong>. This collapses the quantum state into a single real number.
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-rose-200 font-mono text-xs text-rose-700">
                            <div>⟨ψ|Z₀|ψ⟩ → value ∈ [-1, +1]</div>
                            <div className="mt-2">P(Risk) = (⟨Z₀⟩ + 1) / 2 → value ∈ [0, 1]</div>
                            <div className="mt-2 text-[10px] text-slate-500 font-sans">
                                The expectation value encodes information from <em>all 14 qubits</em> because entanglement
                                has correlated qubit 0 with every other qubit. Measuring one qubit effectively summarizes
                                the entire quantum state.
                            </div>
                        </div>
                    </div>

                    {/* Training */}
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">4</span>
                            <span className="font-bold text-sm text-amber-900">Adam Optimizer — Training Loop</span>
                        </div>
                        <div className="text-xs text-amber-800 leading-relaxed mb-3">
                            The circuit's {(cfg.layers || 4) * 14 * 3} rotation angles are the trainable parameters. We optimize them
                            using the <strong>Adam optimizer</strong> (Adaptive Moment Estimation), which adapts the learning rate
                            per-parameter and is well-suited for the noisy, non-convex loss landscapes of quantum circuits.
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white rounded-lg p-3 border border-amber-200">
                                <div className="text-[11px] font-bold text-amber-700 mb-1">Loss Function</div>
                                <div className="text-[10px] text-slate-600 leading-relaxed">
                                    Mean Squared Error (MSE) between circuit output and labels (±1).
                                </div>
                                <div className="text-[9px] font-mono text-amber-500 mt-1">L = mean((pred - y)²)</div>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-amber-200">
                                <div className="text-[11px] font-bold text-amber-700 mb-1">Training Config</div>
                                <div className="text-[10px] text-slate-600 space-y-0.5">
                                    <div>Learning Rate: <strong>{cfg.learning_rate || 0.02}</strong></div>
                                    <div>Batch Size: <strong>{cfg.batch_size || 64}</strong></div>
                                    <div>Steps: <strong>{cfg.training_steps || 500}</strong></div>
                                    <div>Split: <strong>80/20 stratified</strong></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── OUTPUT & TRIAGE ── */}
            <section className="bg-gradient-to-br from-qm-600 to-qm-800 rounded-2xl p-6 text-white">
                <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
                    <Zap className="w-5 h-5 text-qm-200" /> Holistic Triage Output
                </h2>
                <p className="text-sm text-qm-100 leading-relaxed mb-4">
                    The model doesn't just output a binary yes/no. It produces a <strong>comprehensive risk assessment</strong> with
                    multiple layers of interpretation:
                </p>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { title: 'Risk Probability', desc: '0–100% continuous probability score from the quantum circuit output', icon: '📊' },
                        { title: 'Risk Tier', desc: 'Low (<40%), Moderate (40–70%), High (70–85%), Crisis (>85%) classification tiers', icon: '🎯' },
                        { title: 'Depression Probability', desc: 'Weighted combination of risk score, anxiety, and social isolation markers', icon: '🧠' },
                        { title: 'Severity Level', desc: 'Mild, Moderate, Severe, or Critical with specific clinical recommendations', icon: '⚕️' },
                        { title: 'Feature Breakdown', desc: 'Each of the 14 features rated 1–5 with health indicators (good/moderate/concerning)', icon: '📋' },
                        { title: 'Concerning Areas', desc: 'Automatic identification of features flagged as concerning for focused intervention', icon: '⚠️' },
                    ].map(item => (
                        <div key={item.title} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                            <div className="text-sm mb-1">{item.icon}</div>
                            <div className="text-xs font-bold text-white">{item.title}</div>
                            <div className="text-[10px] text-qm-200 leading-relaxed">{item.desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── WHY QUANTUM FOR THIS ── */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6">
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">
                    <Sparkles className="w-5 h-5 text-amber-500" /> Why Quantum Computing for Mental Health?
                </h2>
                <div className="space-y-3 text-sm text-slate-700">
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                        <div className="font-bold text-amber-900 text-xs mb-1">Superposition — Multiple States at Once</div>
                        <div className="text-xs text-amber-800 leading-relaxed">
                            A classical bit is either 0 or 1. A qubit can be in a <em>superposition</em> of both simultaneously.
                            When we encode a student's sleep quality as a rotation angle, the qubit represents a continuous
                            spectrum of sleep quality — not just "good" or "bad" — enabling nuanced classification.
                        </div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                        <div className="font-bold text-blue-900 text-xs mb-1">Entanglement — Features That Interact</div>
                        <div className="text-xs text-blue-800 leading-relaxed">
                            Mental health is inherently <em>entangled</em>: poor sleep worsens anxiety, high academic pressure
                            reduces social activity, substance use impairs cognition. Quantum entanglement naturally models
                            these multi-way correlations. After the StronglyEntanglingLayers, every qubit is correlated with
                            every other — the model "knows" that sleep + anxiety + isolation together create a compounding risk.
                        </div>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                        <div className="font-bold text-emerald-900 text-xs mb-1">Exponential State Space</div>
                        <div className="text-xs text-emerald-800 leading-relaxed">
                            With 14 qubits, the quantum state lives in a 2<sup>14</sup> = 16,384-dimensional Hilbert space.
                            This means the circuit can represent relationships that would require a classical neural network
                            with thousands of hidden neurons. With just {(cfg.layers || 4) * 14 * 3} parameters, our VQC
                            operates in this vast space — achieving high expressiveness with minimal parameter overhead.
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
