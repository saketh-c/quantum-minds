import { Network, Server, Globe, Shield, Mic, Gamepad2, ClipboardList, Brain } from 'lucide-react';

function FlowStep({ number, title, description, color = 'blue' }) {
    return (
        <div className="flex gap-4">
            <div className={`w-8 h-8 rounded-full bg-${color}-100 text-${color}-700 flex items-center justify-center text-sm font-bold flex-shrink-0`}>
                {number}
            </div>
            <div>
                <div className="font-bold text-slate-900">{title}</div>
                <div className="text-sm text-slate-600">{description}</div>
            </div>
        </div>
    );
}

export default function Architecture() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 mb-2">System Architecture</h1>
                <p className="text-slate-600">Complete system topology, data flow, API integrations, and technology stack.</p>
            </div>

            {/* System Diagram */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6">System Topology</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Frontend */}
                    <div className="border-2 border-blue-200 rounded-xl p-5 bg-blue-50">
                        <div className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                            <Globe className="w-5 h-5" /> React Frontend
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="bg-white rounded-lg p-3 border border-blue-100">
                                <Gamepad2 className="w-4 h-4 text-blue-600 inline mr-2" />
                                <strong>Focus Game</strong> — Stroop Test
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-blue-100">
                                <Gamepad2 className="w-4 h-4 text-blue-600 inline mr-2" />
                                <strong>Memory Game</strong> — Pattern Recall
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-blue-100">
                                <Mic className="w-4 h-4 text-red-500 inline mr-2" />
                                <strong>Voice Analysis</strong> — Hume EVI
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-blue-100">
                                <ClipboardList className="w-4 h-4 text-green-600 inline mr-2" />
                                <strong>Survey Form</strong> — Lifestyle Data
                            </div>
                        </div>
                        <div className="text-xs text-blue-600 mt-3 font-mono">Vite + React 18 + Tailwind CSS</div>
                    </div>

                    {/* Backend */}
                    <div className="border-2 border-emerald-200 rounded-xl p-5 bg-emerald-50">
                        <div className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                            <Server className="w-5 h-5" /> Flask Backend
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="bg-white rounded-lg p-3 border border-emerald-100">
                                <Shield className="w-4 h-4 text-emerald-600 inline mr-2" />
                                <strong>/login</strong> — JWT Authentication
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-emerald-100">
                                <Brain className="w-4 h-4 text-purple-600 inline mr-2" />
                                <strong>/predict</strong> — Quantum Inference
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-emerald-100">
                                <Mic className="w-4 h-4 text-red-500 inline mr-2" />
                                <strong>/hume/token</strong> — OAuth Proxy
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-emerald-100">
                                <ClipboardList className="w-4 h-4 text-amber-600 inline mr-2" />
                                <strong>/analyze_transcript</strong> — LLM
                            </div>
                        </div>
                        <div className="text-xs text-emerald-600 mt-3 font-mono">Flask + Gunicorn + Cloud Run</div>
                    </div>

                    {/* External */}
                    <div className="border-2 border-violet-200 rounded-xl p-5 bg-violet-50">
                        <div className="font-bold text-violet-900 mb-4 flex items-center gap-2">
                            <Network className="w-5 h-5" /> External Services
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="bg-white rounded-lg p-3 border border-violet-100">
                                <div className="font-bold text-violet-900">PennyLane Engine</div>
                                <div className="text-xs text-violet-600">14-Qubit VQC • 2 Layers • 84 Params</div>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-violet-100">
                                <div className="font-bold text-violet-900">Hume AI EVI</div>
                                <div className="text-xs text-violet-600">WebSocket Streaming • Voice Prosody</div>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-violet-100">
                                <div className="font-bold text-violet-900">Together AI</div>
                                <div className="text-xs text-violet-600">Llama 3.1-8B • Transcript Analysis</div>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-violet-100">
                                <div className="font-bold text-violet-900">Google Cloud Run</div>
                                <div className="text-xs text-violet-600">Serverless Docker Deployment</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Data Flow */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Complete Data Flow</h2>
                <div className="space-y-6">
                    <FlowStep number="1" title="User Authentication" description="User logs in with credentials. Flask issues a JWT access token (1-hour expiry). Token stored in localStorage and sent with all subsequent API requests." color="slate" />
                    <div className="border-l-2 border-slate-200 ml-4 pl-8">
                        <FlowStep number="2" title="Cognitive Assessment: Focus Game" description="Stroop test measures attention and cognitive connectivity. Score normalized to 0-1 and stored as Feature 0 (Connectivity) in the 14-element vector." color="blue" />
                        <div className="mt-4">
                            <FlowStep number="3" title="Cognitive Assessment: Memory Game" description="Pattern recall task measures hippocampal memory function. Score normalized to 0-1 and stored as Feature 1 (Memory) in the vector." color="blue" />
                        </div>
                    </div>
                    <div className="border-l-2 border-red-200 ml-4 pl-8">
                        <FlowStep number="4" title="Voice Analysis via Hume AI" description="Backend proxies an OAuth token from Hume AI. Frontend connects via WebSocket to Hume EVI. Real-time prosody analysis extracts emotion scores. Anxiety mapped to Feature 4, Isolation to Feature 5." color="red" />
                    </div>
                    <div className="border-l-2 border-green-200 ml-4 pl-8">
                        <FlowStep number="5" title="Survey + LLM Transcript Analysis" description="User answers survey questions (Sleep, Diet, Substance, Academic) while voice records. Transcript sent to Together AI (Llama 3.1-8B) which extracts structured ratings. Survey values mapped to Features 2, 6, 7, 8." color="green" />
                    </div>
                    <FlowStep number="6" title="Feature Vector Assembly" description="All 14 features combined into a single vector [0-1 normalized]. Features 3, 9-13 use default estimates (0.5). Vector sent to /predict endpoint." color="amber" />
                    <FlowStep number="7" title="Quantum Circuit Execution" description="PennyLane encodes vector into 14 qubits via AngleEmbedding. StronglyEntanglingLayers process through 2 layers of parameterized gates. PauliZ expectation measured on Qubit 0. Result mapped to risk probability." color="violet" />
                    <FlowStep number="8" title="Risk Classification & Report" description="Risk probability classified into tiers (Low/Moderate/High/Crisis). Depression probability computed. Comprehensive feature report generated. Results displayed to user with detailed breakdown." color="emerald" />
                </div>
            </div>

            {/* Tech Stack */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Technology Stack</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-bold text-slate-800 mb-3">Frontend</h3>
                        <div className="space-y-2 text-sm">
                            {[
                                ['React 18', 'UI component library with hooks'],
                                ['Vite', 'Build tool & dev server'],
                                ['Tailwind CSS', 'Utility-first CSS framework'],
                                ['Axios', 'HTTP client for API calls'],
                                ['Lucide React', 'Icon library'],
                                ['Hume SDK', 'Voice analysis WebSocket client'],
                            ].map(([tech, desc]) => (
                                <div key={tech} className="flex justify-between bg-slate-50 p-2 rounded">
                                    <span className="font-mono font-semibold text-blue-700">{tech}</span>
                                    <span className="text-slate-500">{desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 mb-3">Backend</h3>
                        <div className="space-y-2 text-sm">
                            {[
                                ['Flask', 'Python web framework'],
                                ['PennyLane', 'Quantum ML framework'],
                                ['Gunicorn', 'WSGI HTTP server'],
                                ['Flask-JWT', 'JWT authentication'],
                                ['Together AI SDK', 'LLM API client'],
                                ['scikit-learn', 'ML metrics & evaluation'],
                            ].map(([tech, desc]) => (
                                <div key={tech} className="flex justify-between bg-slate-50 p-2 rounded">
                                    <span className="font-mono font-semibold text-emerald-700">{tech}</span>
                                    <span className="text-slate-500">{desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Deployment */}
            <div className="bg-slate-900 text-white rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">Deployment Architecture</h2>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-slate-800 rounded-lg p-4">
                        <div className="font-bold text-blue-400 mb-2">Frontend Container</div>
                        <div className="text-slate-400 font-mono text-xs space-y-1">
                            <div>FROM node:20-slim → build</div>
                            <div>FROM nginx:alpine → serve</div>
                            <div>Port: 8080</div>
                            <div>Cloud Run: quantum-frontend</div>
                        </div>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-4">
                        <div className="font-bold text-emerald-400 mb-2">Backend Container</div>
                        <div className="text-slate-400 font-mono text-xs space-y-1">
                            <div>FROM python:3.10-slim</div>
                            <div>Gunicorn: 1 worker, 8 threads</div>
                            <div>Port: 8080</div>
                            <div>Cloud Run: quantum-backend</div>
                        </div>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-4">
                        <div className="font-bold text-violet-400 mb-2">Docker Compose (Local)</div>
                        <div className="text-slate-400 font-mono text-xs space-y-1">
                            <div>Backend → localhost:5001</div>
                            <div>Frontend → localhost:5173</div>
                            <div>Docs → localhost:3000</div>
                            <div>Hot-reload volumes</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
