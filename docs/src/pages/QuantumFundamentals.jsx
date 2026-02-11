import { Atom, Zap, Link2, Gauge } from 'lucide-react';

function Section({ icon: Icon, title, children, color = 'blue' }) {
    return (
        <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl bg-${color}-100 text-${color}-600 flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
            </div>
            {children}
        </div>
    );
}

function InfoBox({ title, children, color = 'blue' }) {
    return (
        <div className={`bg-${color}-50 border-l-4 border-${color}-500 p-5 rounded-r-xl mb-4`}>
            <h4 className={`font-bold text-${color}-900 mb-2`}>{title}</h4>
            <div className={`text-${color}-800 text-sm leading-relaxed`}>{children}</div>
        </div>
    );
}

export default function QuantumFundamentals() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 mb-2">Quantum Computing Fundamentals</h1>
                <p className="text-slate-600">Understanding the building blocks of quantum machine learning, from classical bits to quantum entanglement.</p>
            </div>

            {/* Classical vs Quantum */}
            <Section icon={Atom} title="1. Classical Bits vs. Quantum Qubits" color="violet">
                <div className="text-slate-700 space-y-4 mb-6">
                    <p>
                        In a <strong>classical computer</strong>, information is stored in <strong>bits</strong>. A bit is like a light switch — it is either <strong>OFF (0)</strong> or <strong>ON (1)</strong>. Every computation, from playing a video to running an AI model, is built on billions of these binary switches.
                    </p>
                    <p>
                        A <strong>quantum computer</strong> uses <strong>qubits</strong> (quantum bits). Unlike classical bits, a qubit can exist in a state called <strong>superposition</strong> — it represents <em>both</em> 0 and 1 simultaneously, with different probabilities for each.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white border border-slate-200 rounded-xl p-6">
                        <h4 className="font-bold text-slate-900 mb-3">Classical Bit</h4>
                        <div className="flex items-center justify-center gap-8 mb-4">
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-2xl font-black text-slate-700">0</div>
                                <div className="text-xs text-slate-500 mt-1">OFF</div>
                            </div>
                            <div className="text-slate-400 font-bold">OR</div>
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-2xl font-black text-white">1</div>
                                <div className="text-xs text-slate-500 mt-1">ON</div>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600">A classical bit is deterministic. It is always in one definite state. Like a coin glued to a table — it is permanently heads or tails.</p>
                    </div>

                    <div className="bg-gradient-to-br from-violet-50 to-blue-50 border border-violet-200 rounded-xl p-6">
                        <h4 className="font-bold text-violet-900 mb-3">Quantum Qubit</h4>
                        <div className="flex items-center justify-center mb-4">
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-lg font-black text-white animate-pulse">
                                    0+1
                                </div>
                                <div className="text-xs text-violet-600 mt-1">Superposition</div>
                            </div>
                        </div>
                        <p className="text-sm text-violet-800">
                            A qubit exists in superposition — both 0 AND 1 at the same time. Like a spinning coin — while spinning, it is not heads or tails, but a <em>probability</em> of each.
                        </p>
                    </div>
                </div>

                <InfoBox title="The Math Behind Superposition" color="violet">
                    <p>A qubit's state is written as: <strong>|ψ⟩ = α|0⟩ + β|1⟩</strong></p>
                    <p className="mt-2">Where α and β are complex numbers called <strong>amplitudes</strong>. The probability of measuring 0 is |α|² and the probability of measuring 1 is |β|². The constraint is: |α|² + |β|² = 1.</p>
                    <p className="mt-2">For example, a qubit in the state <strong>|ψ⟩ = 0.6|0⟩ + 0.8|1⟩</strong> has a 36% chance of being 0 and a 64% chance of being 1.</p>
                </InfoBox>

                <div className="bg-white border border-slate-200 rounded-xl p-6">
                    <h4 className="font-bold text-slate-900 mb-3">Why Does This Matter for Mental Health?</h4>
                    <p className="text-sm text-slate-700">
                        A student's mental state isn't binary. They aren't simply "depressed" or "not depressed." They exist on a <strong>spectrum</strong> — maybe 70% likely at risk, 30% likely okay. Qubits naturally represent this continuous probability, making them ideal for modeling the nuanced reality of mental health.
                    </p>
                </div>
            </Section>

            {/* Quantum Gates */}
            <Section icon={Zap} title="2. Quantum Gates — Manipulating Qubits" color="blue">
                <div className="text-slate-700 space-y-4 mb-6">
                    <p>
                        Just as classical computers use logic gates (AND, OR, NOT) to manipulate bits, quantum computers use <strong>quantum gates</strong> to manipulate qubits. The key difference is that quantum gates operate on superpositions, affecting probabilities rather than definite states.
                    </p>
                </div>

                <div className="space-y-6 mb-6">
                    <div className="bg-white border border-slate-200 rounded-xl p-6">
                        <h4 className="font-bold text-slate-900 mb-2">Rotation Gates (RX, RY, RZ)</h4>
                        <p className="text-sm text-slate-700 mb-3">
                            Rotation gates "tilt" the qubit's state by an angle θ. This is how we <strong>encode data</strong> into qubits.
                        </p>
                        <div className="bg-slate-50 p-4 rounded-lg font-mono text-sm">
                            <div className="text-slate-500">// In our model, we encode each feature as a rotation:</div>
                            <div className="text-blue-700">θ = feature_value × π</div>
                            <div className="text-slate-500 mt-1">// High anxiety (0.9) → θ = 0.9π → qubit tilted toward |1⟩ (risk)</div>
                            <div className="text-slate-500">// Low anxiety (0.1) → θ = 0.1π → qubit stays near |0⟩ (safe)</div>
                        </div>
                        <p className="text-sm text-slate-600 mt-3">
                            In Quantum Mind, we use <strong>RY (Y-rotation)</strong> gates via PennyLane's <code className="bg-slate-100 px-1 rounded">AngleEmbedding</code>. Each of the 14 features rotates its corresponding qubit.
                        </p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-6">
                        <h4 className="font-bold text-slate-900 mb-2">CNOT Gate (Controlled-NOT)</h4>
                        <p className="text-sm text-slate-700 mb-3">
                            The CNOT gate is the quantum "If-Then" statement. It connects two qubits: a <strong>Control</strong> and a <strong>Target</strong>.
                        </p>
                        <div className="bg-slate-50 p-4 rounded-lg mb-3">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="font-bold text-slate-900">Rule:</div>
                                    <p className="text-slate-700">If Control = |1⟩ → Flip Target</p>
                                    <p className="text-slate-700">If Control = |0⟩ → Do nothing</p>
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900">Clinical Example:</div>
                                    <p className="text-slate-700">Control = Anxiety qubit</p>
                                    <p className="text-slate-700">Target = Sleep qubit</p>
                                    <p className="text-slate-700">Result: "Anxiety-Induced Insomnia"</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600">
                            The CNOT gate creates <strong>dependency</strong> between qubits. After a CNOT, the Target qubit's state depends on the Control qubit. This models real-world interactions between symptoms.
                        </p>
                    </div>
                </div>
            </Section>

            {/* Entanglement */}
            <Section icon={Link2} title="3. Entanglement — The Quantum Superpower" color="indigo">
                <div className="text-slate-700 space-y-4 mb-6">
                    <p>
                        When CNOT gates are applied to qubits that are already in superposition, something profound happens: <strong>Quantum Entanglement</strong>. The qubits become mathematically linked — you can no longer describe them independently. They form a single, unified quantum system.
                    </p>
                </div>

                <InfoBox title="Einstein Called It 'Spooky Action at a Distance'" color="indigo">
                    <p>Albert Einstein was troubled by entanglement because measuring one entangled particle instantly determines the state of the other, regardless of distance. While Einstein doubted it, experiments have since proven entanglement is real and fundamental to nature.</p>
                </InfoBox>

                <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
                    <h4 className="font-bold text-slate-900 mb-3">Why Entanglement Matters for Mental Health</h4>
                    <div className="space-y-4 text-sm text-slate-700">
                        <p>
                            Mental health symptoms don't exist in isolation. Poor sleep worsens anxiety. High anxiety reduces cognitive performance. Academic pressure affects diet. These are <strong>entangled relationships</strong>.
                        </p>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                <div className="font-bold text-indigo-900 mb-1">Classical ML</div>
                                <p className="text-indigo-800 text-xs">Examines features independently or through hand-crafted interactions. Limited to polynomial feature combinations.</p>
                            </div>
                            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                <div className="font-bold text-indigo-900 mb-1">Deep Learning</div>
                                <p className="text-indigo-800 text-xs">Learns interactions through layers of neurons. Can model complex patterns but requires large datasets and many parameters.</p>
                            </div>
                            <div className="bg-gradient-to-br from-indigo-100 to-violet-100 p-4 rounded-lg border border-indigo-200">
                                <div className="font-bold text-indigo-900 mb-1">Quantum ML ✦</div>
                                <p className="text-indigo-800 text-xs">Entanglement <strong>naturally</strong> captures multi-feature correlations in quantum superposition. With just 84 parameters, our VQC models interactions between all 14 features simultaneously.</p>
                            </div>
                        </div>
                        <p>
                            In our model, <strong>StronglyEntanglingLayers</strong> applies rotation + CNOT gates across all 14 qubits, creating a web of entanglement where every symptom can influence every other symptom's contribution to the final risk score.
                        </p>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6">
                    <h4 className="font-bold text-slate-900 mb-3">Entanglement Example in Our Model</h4>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</div>
                            <div><strong>Qubit 4 (Anxiety)</strong> is rotated to 0.9π — high anxiety detected from voice analysis.</div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</div>
                            <div><strong>Qubit 2 (Sleep)</strong> is rotated to 0.2π — poor sleep quality reported.</div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</div>
                            <div><strong>CNOT(4, 2)</strong> entangles them — Sleep's quantum state now depends on Anxiety's state.</div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</div>
                            <div><strong>Result:</strong> The model captures "anxiety-induced insomnia" as an emergent feature — a stronger predictor of crisis than either symptom alone.</div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Measurement */}
            <Section icon={Gauge} title="4. Measurement — Collapsing to a Prediction" color="emerald">
                <div className="text-slate-700 space-y-4 mb-6">
                    <p>
                        After encoding data and creating entanglements, we need to extract a result. This is where <strong>measurement</strong> comes in.
                    </p>
                    <p>
                        In quantum mechanics, measurement is special — it <strong>collapses</strong> the superposition. The qubit's probabilistic state becomes a definite 0 or 1. But since this is random, a single measurement isn't reliable.
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
                    <h4 className="font-bold text-slate-900 mb-3">Expectation Value — Our Solution</h4>
                    <p className="text-sm text-slate-700 mb-4">
                        Instead of measuring once, we calculate the <strong>expectation value</strong> ⟨Z⟩ — the average outcome over many measurements. This gives us a smooth, continuous number.
                    </p>
                    <div className="bg-emerald-50 p-4 rounded-lg mb-4">
                        <div className="font-mono text-sm space-y-2">
                            <div><span className="text-emerald-700 font-bold">Expectation value ⟨Z⟩</span> ranges from <strong>-1</strong> to <strong>+1</strong></div>
                            <div className="text-slate-500">// Convert to probability:</div>
                            <div className="text-emerald-800 font-bold">Risk Score = (⟨Z⟩ + 1) / 2</div>
                            <div className="text-slate-500">// -1 → 0% risk (completely safe)</div>
                            <div className="text-slate-500">//  0 → 50% risk (uncertain)</div>
                            <div className="text-slate-500">// +1 → 100% risk (crisis)</div>
                        </div>
                    </div>
                    <p className="text-sm text-slate-600">
                        In our model, we measure only <strong>Qubit 0</strong> (the Connectivity qubit). Because all 14 qubits are entangled, measuring one qubit gives us information about the entire system — the collective influence of all 14 features is encoded in this single measurement.
                    </p>
                </div>

                <div className="bg-slate-900 text-white rounded-xl p-6">
                    <h4 className="font-bold text-green-400 mb-3">The Pauli-Z Operator</h4>
                    <p className="text-slate-300 text-sm mb-3">
                        We use the Pauli-Z operator for measurement. It assigns value +1 to state |0⟩ and value -1 to state |1⟩.
                    </p>
                    <div className="font-mono text-sm space-y-1 text-green-300">
                        <div>PauliZ |0⟩ = +1 × |0⟩  → "Safe" direction</div>
                        <div>PauliZ |1⟩ = -1 × |1⟩  → "Risk" direction</div>
                    </div>
                    <p className="text-slate-400 text-sm mt-3">
                        The expectation value ⟨Z⟩ tells us how much the qubit leans toward safety (+1) or risk (-1) after processing all the entangled symptom data.
                    </p>
                </div>
            </Section>

            {/* Summary */}
            <div className="bg-gradient-to-r from-violet-500 to-blue-500 rounded-xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-4">Summary: The Quantum Pipeline</h2>
                <div className="grid md:grid-cols-4 gap-4 text-sm">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                        <div className="font-bold text-lg mb-1">1. Encode</div>
                        <p>Patient data rotates qubits via AngleEmbedding. Each feature becomes a quantum state.</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                        <div className="font-bold text-lg mb-1">2. Entangle</div>
                        <p>StronglyEntanglingLayers create correlations between all symptoms via rotation + CNOT gates.</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                        <div className="font-bold text-lg mb-1">3. Measure</div>
                        <p>PauliZ expectation on Qubit 0 collapses the entangled state to a risk score (-1 to +1).</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                        <div className="font-bold text-lg mb-1">4. Classify</div>
                        <p>Score mapped to probability (0-100%) and assigned to triage tier (Low → Crisis).</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
