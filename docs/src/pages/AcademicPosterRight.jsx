import { ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';

export default function AcademicPosterRight() {
    return (
        <div className="font-serif max-w-4xl mx-auto p-8 bg-white text-black print:p-0">
            {/* Header */}
            <div className="border-b-4 border-black pb-6 mb-8 text-center">
                <h1 className="text-4xl font-bold uppercase tracking-tight mb-2">
                    Discussion & Future Directions
                </h1>
                <div className="mt-4 text-sm font-sans uppercase tracking-widest text-gray-600">
                    Panel 3: Implications & Next Steps
                </div>
            </div>

            <div className="space-y-8 text-justify">
                {/* Discussion */}
                <section>
                    <h2 className="text-2xl font-bold uppercase border-b-2 border-black mb-4 flex items-center gap-2">
                        <span className="bg-black text-white px-2 py-1 text-sm">07</span> Discussion
                    </h2>
                    <p className="mb-4 leading-relaxed">
                        The VQC model successfully demonstrates that quantum classifiers can achieve competitive performance on complex mental health datasets.
                        <br /><br />
                        <strong>Clinical & Technical Observations:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-2 mb-6">
                        <li><strong>Feature Interaction:</strong> The high importance of Feature 0 (Cognitive Connectivity) and Feature 4 (Anxiety) suggests a strong link between cognitive decline and emotional distress, captured effectively by the entangled layers.</li>
                        <li><strong>Sensitivity:</strong> The model shows high recall (sensitivity), making it a suitable tool for initial screening where missing a positive case (false negative) is more costly than a false alarm.</li>
                        <li><strong>Robustness:</strong> Performance remains stable across different demographic subsets, indicating good generalization.</li>
                    </ul>
                </section>

                {/* Limitations */}
                <section>
                    <h2 className="text-2xl font-bold uppercase border-b-2 border-black mb-4 flex items-center gap-2">
                        <span className="bg-black text-white px-2 py-1 text-sm">08</span> Limitations
                    </h2>
                    <div className="border-l-4 border-black pl-4 py-2 bg-gray-50">
                        <div className="flex items-start gap-3 mb-2">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-1" />
                            <p className="text-sm"><strong>Dataset Size:</strong> While 2,807 samples are sufficient for initial validation, larger clinical datasets are needed for robust deployment.</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-1" />
                            <p className="text-sm"><strong> NISQ Hardware:</strong> Current implementation runs on simulators. Deployment on real quantum hardware (NISQ devices) requires error mitigation strategies.</p>
                        </div>
                    </div>
                </section>

                {/* Future Work */}
                <section>
                    <h2 className="text-2xl font-bold uppercase border-b-2 border-black mb-4 flex items-center gap-2">
                        <span className="bg-black text-white px-2 py-1 text-sm">09</span> Future Directions
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-bold border-b border-gray-400 mb-2 pb-1">Clinical Integration</h3>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-start gap-2">
                                    <ArrowRight className="w-4 h-4 mt-0.5" />
                                    <span>Integration with Electronic Health Records (EHR) via FHIR standards.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <ArrowRight className="w-4 h-4 mt-0.5" />
                                    <span>Longitudinal studies to track patient progress over time.</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold border-b border-gray-400 mb-2 pb-1">Technical Enhancements</h3>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-start gap-2">
                                    <ArrowRight className="w-4 h-4 mt-0.5" />
                                    <span>Hybrid Quantum-Classical Neural Networks (QNNs) for image analysis (MRI/fMRI).</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <ArrowRight className="w-4 h-4 mt-0.5" />
                                    <span>Real-time edge deployment using quantized models.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* VIZ: Roadmap Timeline */}
                    <div className="mt-8 border-t-2 border-dotted border-black pt-4">
                        <div className="grid grid-cols-3 gap-4 text-center text-xs">
                            <div className="relative p-2">
                                <div className="font-bold uppercase mb-1">Phase 1 (Current)</div>
                                <div className="border border-black p-2 bg-gray-100">Prototype & Validation</div>
                                <div className="text-gray-500 mt-1">N=2800, Simulator</div>
                            </div>
                            <div className="relative p-2">
                                <div className="font-bold uppercase mb-1">Phase 2 (2026)</div>
                                <div className="border border-black p-2 bg-white">Clinical Pilot</div>
                                <div className="text-gray-500 mt-1">Partner Schools</div>
                                <div className="absolute top-1/2 -left-2 w-4 h-[2px] bg-black"></div>
                            </div>
                            <div className="relative p-2">
                                <div className="font-bold uppercase mb-1">Phase 3 (2027+)</div>
                                <div className="border border-black p-2 bg-white">NISQ Deployment</div>
                                <div className="text-gray-500 mt-1">Real Quantum Hardware</div>
                                <div className="absolute top-1/2 -left-2 w-4 h-[2px] bg-black"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Conclusion */}
                <section className="bg-black text-white p-6 mt-8">
                    <h2 className="text-xl font-bold uppercase mb-2 border-b border-white pb-2 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" /> Conclusion
                    </h2>
                    <p className="leading-relaxed text-sm">
                        Quantum Mind represents a significant step towards precision psychiatry. By combining gamified cognitive assessment, voice biomarkers, and quantum machine learning, we provide a holistic, objective, and accessible tool for mental health screening.
                    </p>
                </section>

                {/* References */}
                <section className="text-xs text-gray-500 mt-8 pt-4 border-t border-gray-300">
                    <h3 className="font-bold uppercase mb-2 text-black">Selected References</h3>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Schuld, M., et al. (2019). "Quantum machine learning in feature Hilbert spaces." <em>Physical Review Letters</em>.</li>
                        <li>Cerezo, M., et al. (2021). "Variational quantum algorithms." <em>Nature Reviews Physics</em>.</li>
                        <li>Hume AI. (2024). "Empathic Voice Interface Documentation."</li>
                    </ol>
                </section>

                {/* Footer */}
                <div className="text-xs font-mono text-center border-t border-black pt-4 mt-4">
                    Quantum Mind Project | Conclusion Panel
                </div>
            </div>
        </div>
    );
}
