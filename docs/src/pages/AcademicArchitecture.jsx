import { Network, Server, Globe, Shield, Mic, Gamepad2, ClipboardList, Brain } from 'lucide-react';

export default function AcademicArchitecture() {
    return (
        <div className="font-serif max-w-5xl mx-auto space-y-12 pb-20 print:space-y-8 print:pb-0">
            {/* Header */}
            <div className="border-b-2 border-black pb-4">
                <h1 className="text-3xl font-bold text-black uppercase tracking-wide">
                    System Architecture & Topology
                </h1>
                <p className="text-gray-700 italic mt-1">
                    Full Stack Implementation Details (React, Flask, Quantum PennyLane)
                </p>
            </div>

            {/* System Topology Diagram */}
            <section>
                <h2 className="text-lg font-bold text-black uppercase border-b border-gray-400 mb-6 pb-1">
                    1. System Topology Map
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Frontend */}
                    <div className="border border-black p-4">
                        <div className="font-bold text-black mb-4 flex items-center gap-2 border-b border-black pb-2">
                            <Globe className="w-5 h-5" /> Client Side (React)
                        </div>
                        <ul className="space-y-2 text-sm text-black">
                            <li className="flex items-center gap-2">
                                <Gamepad2 className="w-4 h-4" /> Focus & Memory Games
                            </li>
                            <li className="flex items-center gap-2">
                                <Mic className="w-4 h-4" /> Voice Recording (Hume)
                            </li>
                            <li className="flex items-center gap-2">
                                <ClipboardList className="w-4 h-4" /> Survey Interface
                            </li>
                        </ul>
                        <div className="text-xs mt-4 pt-2 border-t border-gray-300 italic">
                            Running on: Browser / Docker Nginx
                        </div>
                    </div>

                    {/* Backend */}
                    <div className="border border-black p-4 bg-gray-50">
                        <div className="font-bold text-black mb-4 flex items-center gap-2 border-b border-black pb-2">
                            <Server className="w-5 h-5" /> Server Side (Flask)
                        </div>
                        <ul className="space-y-2 text-sm text-black">
                            <li className="flex items-center gap-2">
                                <Shield className="w-4 h-4" /> JWT Auth & REST API
                            </li>
                            <li className="flex items-center gap-2">
                                <Brain className="w-4 h-4" /> Quantum Inference Engine
                            </li>
                            <li className="flex items-center gap-2">
                                <Network className="w-4 h-4" /> Proxy: Hume & LLM
                            </li>
                        </ul>
                        <div className="text-xs mt-4 pt-2 border-t border-gray-300 italic">
                            Running on: Google Cloud Run (Python 3.10)
                        </div>
                    </div>

                    {/* External Services */}
                    <div className="border border-black p-4">
                        <div className="font-bold text-black mb-4 flex items-center gap-2 border-b border-black pb-2">
                            <Network className="w-5 h-5" /> External Services
                        </div>
                        <ul className="space-y-2 text-sm text-black">
                            <li className="flex items-center gap-2">
                                <strong>Hume AI:</strong> Voice Prosody Analysis
                            </li>
                            <li className="flex items-center gap-2">
                                <strong>Together AI:</strong> Llama 3.1 Transcript
                            </li>
                            <li className="flex items-center gap-2">
                                <strong>PennyLane:</strong> Quantum Circuit Sim
                            </li>
                        </ul>
                        <div className="text-xs mt-4 pt-2 border-t border-gray-300 italic">
                            APIs & Cloud Infrastructure
                        </div>
                    </div>
                </div>
            </section>

            {/* Data Flow Table */}
            <section>
                <h2 className="text-lg font-bold text-black uppercase border-b border-gray-400 mb-6 pb-1">
                    2. End-to-End Data Flow
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse border border-black">
                        <thead className="bg-gray-100 text-black border-b border-black">
                            <tr>
                                <th className="border-r border-black px-4 py-2 w-12">Step</th>
                                <th className="border-r border-black px-4 py-2 w-1/4">Process</th>
                                <th className="border-r border-black px-4 py-2">Detailed Action</th>
                                <th className="px-4 py-2">Component</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-300">
                            <tr>
                                <td className="border-r border-black px-4 py-2 font-bold text-center">1</td>
                                <td className="border-r border-black px-4 py-2 font-bold">Authentication</td>
                                <td className="border-r border-black px-4 py-2">User logs in; JWT token issued (1hr expiry).</td>
                                <td className="px-4 py-2">Flask Auth</td>
                            </tr>
                            <tr>
                                <td className="border-r border-black px-4 py-2 font-bold text-center">2</td>
                                <td className="border-r border-black px-4 py-2 font-bold">Data Capture</td>
                                <td className="border-r border-black px-4 py-2">Games (react/focus), Voice (audio/socket), Survey (form).</td>
                                <td className="px-4 py-2">React Client</td>
                            </tr>
                            <tr>
                                <td className="border-r border-black px-4 py-2 font-bold text-center">3</td>
                                <td className="border-r border-black px-4 py-2 font-bold">Feature Extraction</td>
                                <td className="border-r border-black px-4 py-2">Raw data → 14 Normalized Features [0-1].</td>
                                <td className="px-4 py-2">Preprocessing</td>
                            </tr>
                            <tr>
                                <td className="border-r border-black px-4 py-2 font-bold text-center">4</td>
                                <td className="border-r border-black px-4 py-2 font-bold">Quantum Encoding</td>
                                <td className="border-r border-black px-4 py-2">AngleEmbedding maps features to qubit rotations.</td>
                                <td className="px-4 py-2">PennyLane</td>
                            </tr>
                            <tr>
                                <td className="border-r border-black px-4 py-2 font-bold text-center">5</td>
                                <td className="border-r border-black px-4 py-2 font-bold">Inference</td>
                                <td className="border-r border-black px-4 py-2">Circuit execution + Measurement ⟨Z⟩ of Qubit 0.</td>
                                <td className="px-4 py-2">VQC Model</td>
                            </tr>
                            <tr>
                                <td className="border-r border-black px-4 py-2 font-bold text-center">6</td>
                                <td className="border-r border-black px-4 py-2 font-bold">Result</td>
                                <td className="border-r border-black px-4 py-2">Risk Probability calculated and returned to UI.</td>
                                <td className="px-4 py-2">JSON Response</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Technology Stack List */}
            <section>
                <h2 className="text-lg font-bold text-black uppercase border-b border-gray-400 mb-6 pb-1">
                    3. Technology Stack Specification
                </h2>
                <div className="grid md:grid-cols-2 gap-8 text-sm">
                    <div>
                        <h3 className="font-bold border-b border-gray-300 mb-2 pb-1">Frontend Layer</h3>
                        <ul className="list-disc list-inside space-y-1">
                            <li><strong>Runtime:</strong> React 18, Vite</li>
                            <li><strong>Styling:</strong> Tailwind CSS</li>
                            <li><strong>State:</strong> React Hooks, Context API</li>
                            <li><strong>HTTP Client:</strong> Axios</li>
                            <li><strong>Charts:</strong> Chart.js, Recharts</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold border-b border-gray-300 mb-2 pb-1">Backend Layer</h3>
                        <ul className="list-disc list-inside space-y-1">
                            <li><strong>Server:</strong> Python 3.10, Flask 3.0</li>
                            <li><strong>WSGI:</strong> Gunicorn (4 workers)</li>
                            <li><strong>Quantum:</strong> PennyLane 0.34</li>
                            <li><strong>Machine Learning:</strong> Scikit-learn, Numpy</li>
                            <li><strong>Container:</strong> Docker (Slim variants)</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}
