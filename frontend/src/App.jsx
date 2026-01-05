import { useState } from 'react';
import { Brain, Activity, Mic, ShieldCheck, HeartPulse } from 'lucide-react';
import NeonRunner from './components/games/NeonRunner';
import ReactorSabotage from './components/games/ReactorSabotage';
import HumeVoice from './components/HumeVoice';
import SurveyForm from './components/SurveyForm';
import axios from 'axios';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const [step, setStep] = useState('intro'); // intro, focus, memory, voice, survey, calculating, result
    const [vector, setVector] = useState(new Array(14).fill(0.5));
    const [result, setResult] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        try {
            const response = await axios.post('https://quantum-backend-738298079218.us-central1.run.app/login', {
                username,
                password
            });
            const access_token = response.data.access_token;
            setToken(access_token);
            localStorage.setItem('token', access_token);
        } catch (err) {
            setLoginError('Invalid credentials');
        }
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
        setStep('intro');
        setVector(new Array(14).fill(0.5));
        setResult(null);
    };

    const updateVector = (index, value) => {
        const newVec = [...vector];
        newVec[index] = value;
        setVector(newVec);
    };

    const handleFocusComplete = (score) => {
        updateVector(0, score); // 0_Connectivity
        setStep('memory');
    };

    const handleMemoryComplete = (score) => {
        updateVector(1, score); // 1_Hippocampal
        setStep('survey');
    };

    const handleSurveyComplete = async (data) => {
        // Map survey fields to vector
        updateVector(2, data.sleep);
        updateVector(6, data.substance);
        updateVector(7, data.diet);
        updateVector(8, data.academic);

        // Map Voice fields (passed from SurveyForm now)
        updateVector(4, data.prosody.anxiety);
        updateVector(5, data.prosody.isolation);

        // Fill proxies for others if not in survey form
        // ...

        setStep('calculating');
        await runQuantumReferral();
    };

    const runQuantumReferral = async () => {
        try {
            const response = await axios.post('https://quantum-backend-738298079218.us-central1.run.app/predict', {
                features: vector
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setResult(response.data);
            setStep('result');
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 401) {
                alert("Session expired. Please login again.");
                handleLogout();
            } else {
                alert("Error contacting Quantum Core");
                setStep('result'); // Show fallback or error
            }
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Quantum Access</h2>
                    <p className="text-center text-slate-500 mb-8">Please authenticate to continue.</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Enter username"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Enter password"
                            />
                        </div>

                        {loginError && (
                            <div className="text-red-500 text-sm text-center">{loginError}</div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">

            {/* Header */}
            <header className="p-4 md:p-6 flex items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <Brain className="text-blue-600 w-8 h-8" />
                    <h1 className="text-xl font-bold tracking-tight text-slate-800">Quantum Minds</h1>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                    <div className={`flex items-center gap-1 ${step === 'focus' ? 'text-blue-600' : ''}`}>
                        <Activity className="w-4 h-4" /> <span className="hidden sm:inline">Focus</span>
                    </div>
                    <div className={`flex items-center gap-1 ${step === 'voice' ? 'text-red-500' : ''}`}>
                        <Mic className="w-4 h-4" /> <span className="hidden sm:inline">Voice</span>
                    </div>
                    <button onClick={handleLogout} className="text-slate-400 hover:text-slate-800 transition-colors">
                        Logout
                    </button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-3xl">

                {step === 'intro' && (
                    <div className="text-center mt-8 md:mt-12 flex flex-col items-center">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-blue-600">
                            <HeartPulse className="w-10 h-10" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 leading-tight">
                            Mental Health Triage
                        </h2>
                        <p className="text-lg text-slate-600 mb-12 max-w-xl mx-auto leading-relaxed">
                            We use <span className="text-blue-600 font-bold">Quantum Machine Learning</span> to detect "entangled" states of distress by analyzing your
                            brain connectivity, voice, and lifestyle.
                        </p>
                        <button
                            onClick={() => setStep('focus')}
                            className="bg-blue-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95"
                        >
                            Start Assessment
                        </button>
                    </div>
                )}

                {step === 'focus' && <NeonRunner onComplete={handleFocusComplete} />}
                {step === 'memory' && <ReactorSabotage onComplete={handleMemoryComplete} />}
                {step === 'survey' && <SurveyForm onComplete={handleSurveyComplete} />}

                {step === 'calculating' && (
                    <div className="text-center mt-20 animate-pulse">
                        <div className="w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-8" />
                        <h3 className="text-2xl font-bold text-slate-800">Analyzing Quantum State...</h3>
                        <p className="text-slate-500 mt-2">Computing Hilbert Space Projections</p>
                    </div>
                )}

                {step === 'result' && result && (
                    <div className="mt-8 text-center">
                        <div className="inline-block p-1 rounded-3xl bg-gradient-to-br from-blue-400 via-teal-400 to-emerald-400 mb-8 shadow-2xl shadow-blue-100">
                            <div className="bg-white rounded-[22px] p-8 md:p-12">
                                <div className="uppercase tracking-widest text-sm text-slate-400 mb-4 font-semibold">Risk Probability</div>
                                <div className="text-6xl font-black text-slate-900 mb-2">
                                    {(result.risk_probability * 100).toFixed(1)}%
                                </div>
                                <div className={`text-2xl font-bold ${result.risk_tier === 'Crisis' ? 'text-red-500' :
                                    result.risk_tier === 'High' ? 'text-orange-500' : 'text-green-600'
                                    }`}>
                                    {result.risk_tier} Tier
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto text-left">
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                <div className="text-slate-500 text-sm mb-1 font-medium">Anxiety (Voice)</div>
                                <div className="text-xl font-bold text-slate-800">{(vector[4] * 100).toFixed(0)}%</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                <div className="text-slate-500 text-sm mb-1 font-medium">Connectivity (Game)</div>
                                <div className="text-xl font-bold text-slate-800">{(vector[0] * 100).toFixed(0)}%</div>
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm col-span-2">
                                <div className="text-slate-500 text-sm mb-1 font-medium">Quantum Raw Z-Expectation</div>
                                <div className="text-lg font-mono text-slate-600">{result.quantum_raw.toFixed(4)}</div>
                            </div>
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="mt-12 text-slate-500 hover:text-blue-600 underline decoration-slate-300 underline-offset-4 font-medium"
                        >
                            Reset Simulation
                        </button>
                    </div>
                )}

            </main>
        </div>
    );
}

export default App;
