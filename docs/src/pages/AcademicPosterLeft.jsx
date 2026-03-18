export default function AcademicPosterLeft() {
    return (
        <div className="font-serif max-w-4xl mx-auto p-8 bg-white text-black print:p-0">
            {/* Header */}
            <div className="border-b-4 border-black pb-6 mb-8 text-center">
                <h1 className="text-4xl font-bold uppercase tracking-tight mb-2">
                    Quantum Machine Learning for Mental Health
                </h1>
                <p className="text-xl italic">
                    A Variational Quantum Classifier (VQC) Approach to Depression Screening
                </p>
                <div className="mt-4 text-sm font-sans uppercase tracking-widest text-gray-600">
                    Panel 1: Introduction & Methodology
                </div>
            </div>

            <div className="space-y-8 text-justify">
                {/* Abstract */}
                <section>
                    <h2 className="text-2xl font-bold uppercase border-b-2 border-black mb-4 flex items-center gap-2">
                        <span className="bg-black text-white px-2 py-1 text-sm">01</span> Abstract
                    </h2>
                    <p className="mb-4 leading-relaxed">
                        Mental health diagnostics often rely on singular data modalities, missing the complex, non-linear interactions between cognitive, emotional, and lifestyle factors. We present a novel <strong>Variational Quantum Classifier (VQC)</strong> that integrates multi-modal data—including voice prosody, cognitive game performance, and self-reported surveys—to predict depression risk.
                    </p>
                    <p className="leading-relaxed">
                        By leveraging <strong>quantum entanglement</strong>, our model captures symptom correlations that classical linear models may overlook. Trained on 2,807 samples, the system achieves comparable accuracy to classical baselines while offering greater interpretability through quantum feature interactions.
                    </p>
                </section>

                {/* Problem Statement */}
                <section>
                    <h2 className="text-2xl font-bold uppercase border-b-2 border-black mb-4 flex items-center gap-2">
                        <span className="bg-black text-white px-2 py-1 text-sm">02</span> Problem Statement
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="border border-black p-4">
                            <h3 className="font-bold border-b border-black mb-2">The Clinical Gap</h3>
                            <ul className="list-disc list-inside space-y-2 text-sm">
                                <li>Subjective self-reporting is error-prone.</li>
                                <li>Symptoms are treated in isolation (e.g., treating sleep without considering anxiety).</li>
                                <li>Lack of continuous, objective monitoring.</li>
                            </ul>
                        </div>
                        <div className="border border-black p-4">
                            <h3 className="font-bold border-b border-black mb-2">The Computational Challenge</h3>
                            <ul className="list-disc list-inside space-y-2 text-sm">
                                <li>High-dimensional, multi-modal data.</li>
                                <li>Non-linear dependencies between features.</li>
                                <li>Need for explainable AI in healthcare.</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Engineering Goals */}
                <section>
                    <h2 className="text-2xl font-bold uppercase border-b-2 border-black mb-4 flex items-center gap-2">
                        <span className="bg-black text-white px-2 py-1 text-sm">03</span> Engineering Goals
                    </h2>
                    <div className="grid md:grid-cols-3 gap-4 text-center">
                        <div className="border border-black p-3">
                            <div className="font-bold border-b border-black mb-2 pb-1 text-sm uppercase">Accessibility</div>
                            <p className="text-xs">Mobile-first React design for universal access.</p>
                        </div>
                        <div className="border border-black p-3">
                            <div className="font-bold border-b border-black mb-2 pb-1 text-sm uppercase">Scalability</div>
                            <p className="text-xs">Containerized Docker/Cloud Run architecture.</p>
                        </div>
                        <div className="border border-black p-3">
                            <div className="font-bold border-b border-black mb-2 pb-1 text-sm uppercase">Hybrid Compute</div>
                            <p className="text-xs">Seamless Classical ↔ Quantum (PennyLane) workflow.</p>
                        </div>
                    </div>
                </section>

                {/* Methodology */}
                <section>
                    <h2 className="text-2xl font-bold uppercase border-b-2 border-black mb-4 flex items-center gap-2">
                        <span className="bg-black text-white px-2 py-1 text-sm">04</span> Methodology
                    </h2>

                    <h3 className="text-lg font-bold mt-6 mb-2">A. Multi-Modal Data Collection</h3>
                    <p className="mb-4">Data is aggregated from three sources into a normalized 14-dimensional feature vector:</p>

                    {/* VIZ: Data Pipeline Flowchart */}
                    <div className="flex items-center justify-between text-center text-xs font-bold font-mono my-6 border border-black p-4 bg-gray-50">
                        <div className="flex flex-col items-center gap-2">
                            <div className="border border-black bg-white px-3 py-2">Users</div>
                            <div>↓</div>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="border border-black bg-white px-2 py-1">Games</div>
                                <div className="border border-black bg-white px-2 py-1">Voice</div>
                                <div className="border border-black bg-white px-2 py-1">Survey</div>
                            </div>
                        </div>
                        <div className="text-xl">→</div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="border border-black bg-white px-3 py-2">Preprocessing</div>
                            <div className="text-[10px] font-normal text-gray-600">(Normalization, FFT)</div>
                        </div>
                        <div className="text-xl">→</div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="border border-black bg-black text-white px-3 py-2">Feature Vector</div>
                            <div className="text-[10px] font-normal text-gray-600">x ∈ [0, π]¹⁴</div>
                        </div>
                    </div>
                    <table className="w-full text-sm border-collapse border border-black mb-6">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-black px-2 py-1">Source</th>
                                <th className="border border-black px-2 py-1">Type</th>
                                <th className="border border-black px-2 py-1">Features Extracted</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-black px-2 py-1"><strong>Cognitive Games</strong></td>
                                <td className="border border-black px-2 py-1">Behavioral</td>
                                <td className="border border-black px-2 py-1">Focus, Memory, Reaction Time</td>
                            </tr>
                            <tr>
                                <td className="border border-black px-2 py-1"><strong>Hume AI</strong></td>
                                <td className="border border-black px-2 py-1">Biometric</td>
                                <td className="border border-black px-2 py-1">Voice Anxiety, Social Isolation</td>
                            </tr>
                            <tr>
                                <td className="border border-black px-2 py-1"><strong>Survey</strong></td>
                                <td className="border border-black px-2 py-1">Self-Report</td>
                                <td className="border border-black px-2 py-1">Sleep, Diet, Substance Use</td>
                            </tr>
                        </tbody>
                    </table>

                    <h3 className="font-bold text-sm uppercase mb-2 border-b-2 border-dotted border-black inline-block">The Science of Voice (Hume AI)</h3>
                    <div className="border border-black p-4 mb-6">
                        <div className="flex gap-4">
                            <div className="flex-1 text-sm">
                                <p className="mb-2">
                                    <strong>Why Voice?</strong> Vocal prosody (rhythm, pitch, tone) acts as a high-fidelity biomarker for mental states. Depressive speech patterns often exhibit flattened affect and extended pauses.
                                </p>
                                <p>
                                    <strong>Methodology:</strong> We integrate Hume AI's <em>Empathic Voice Interface (EVI)</em> to analyze audio samples. The model extracts emotional feature vectors, from which we map <em>Anxiety</em>, <em>Sadness</em>, and <em>Tiredness</em> scores directly to our quantum feature space.
                                </p>
                            </div>
                            <div className="w-1/3 border-l border-black pl-4 flex flex-col justify-center text-center font-mono text-xs">
                                <div className="border border-black p-1 mb-1">Raw Audio</div>
                                <div>↓</div>
                                <div className="border border-black p-1 my-1 bg-gray-100 font-bold">Hume EVI</div>
                                <div>↓</div>
                                <div className="border border-black p-1 mt-1">Emotion Vector</div>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-lg font-bold mt-6 mb-2">B. Quantum Circuit Architecture</h3>
                    <p className="mb-4">The core inference engine is a VQC with the following structure:</p>
                    <div className="border-2 border-black p-6 bg-white">
                        <div className="flex flex-col gap-4 text-center text-sm font-bold font-mono">
                            <div className="border border-black p-2 rounded">State Preparation: AngleEmbedding (Ry Rotations)</div>
                            <div className="text-xl">↓</div>
                            <div className="border border-black p-2 rounded bg-gray-100">Entangling Layers (StronglyEntanglingLayers - 5 Depth)</div>
                            <div className="text-xl">↓</div>
                            <div className="border border-black p-2 rounded">Measurement: Expectation Value ⟨Z0⟩</div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <div className="text-xs font-mono text-center border-t border-black pt-4 mt-8">
                    Quantum Mind Project | Evaluation Setup & Methodology
                </div>
            </div>
        </div>
    );
}
