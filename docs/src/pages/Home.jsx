import { Link } from 'react-router-dom';
import { BarChart3, Atom, Network, Cpu, Database, Zap, Heart, Eye } from 'lucide-react';
import evalData from '../data/evaluationResults.json';

const SECTIONS = [
    {
        title: 'Model Evaluation',
        description: 'F1 scores, precision, recall, AUC-ROC, confusion matrices, and comprehensive performance metrics.',
        path: '/evaluation',
        icon: BarChart3,
        color: 'from-blue-500 to-cyan-500',
        tag: 'Metrics'
    },
    {
        title: 'Quantum Fundamentals',
        description: 'Qubits, superposition, entanglement, and quantum gates explained from the ground up.',
        path: '/quantum',
        icon: Atom,
        color: 'from-violet-500 to-purple-500',
        tag: 'Theory'
    },
    {
        title: 'VQC Deep Dive',
        description: 'Inside our Variational Quantum Classifier — circuit anatomy, encoding, and measurement.',
        path: '/vqc',
        icon: Cpu,
        color: 'from-indigo-500 to-blue-500',
        tag: 'Core Model'
    },
    {
        title: 'System Architecture',
        description: 'Full system topology, API integrations, data flow diagrams, and tech stack breakdown.',
        path: '/architecture',
        icon: Network,
        color: 'from-emerald-500 to-teal-500',
        tag: 'Engineering'
    },
    {
        title: 'Data Pipeline',
        description: 'From raw clinical data to 14-qubit Hilbert space — every transformation explained.',
        path: '/data-pipeline',
        icon: Database,
        color: 'from-amber-500 to-orange-500',
        tag: 'Data'
    },
    {
        title: 'Training Process',
        description: 'Adam optimizer, loss convergence, hyperparameters, and the learning dynamics.',
        path: '/training',
        icon: Zap,
        color: 'from-rose-500 to-pink-500',
        tag: 'ML'
    },
    {
        title: 'Student Impact',
        description: 'How quantum-enhanced mental health screening can help students get early support.',
        path: '/impact',
        icon: Heart,
        color: 'from-red-500 to-rose-500',
        tag: 'Impact'
    },
    {
        title: 'The Bigger Picture',
        description: 'Future of quantum ML in healthcare, NISQ era, and our vision for accessible screening.',
        path: '/vision',
        icon: Eye,
        color: 'from-sky-500 to-blue-500',
        tag: 'Vision'
    },
];

export default function Home() {
    const m = evalData?.metrics;
    const ds = evalData?.dataset;
    const cfg = evalData?.model_config;
    const testPosRate = ds?.test_samples ? (ds.test_positive / ds.test_samples) : null;

    return (
        <div>
            {/* Hero */}
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-qm-100 text-qm-700 rounded-full text-sm font-semibold mb-6">
                    <Atom className="w-4 h-4" />
                    Science Fair Project 2026
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
                    Quantum Mind
                </h1>
                <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-4">
                    <span className="font-semibold text-slate-800">Smartphone-Integrated Psychometric and Biometric Triage Analysis System</span>
                    {' '}Utilizing Hybrid Quantum-Classical Machine Learning
                </p>
                <p className="text-base text-slate-500 max-w-2xl mx-auto">
                    A comprehensive workshop guide explaining every component — from quantum computing fundamentals
                    to model evaluation metrics — of our mental health triage application.
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                {[
                    { label: 'Qubits', value: String(cfg?.qubits ?? 14), sub: 'Quantum features' },
                    { label: 'Accuracy', value: m ? `${(m.accuracy * 100).toFixed(2)}%` : '—', sub: 'Test set' },
                    { label: 'AUC-ROC', value: m ? `${(m.auc_roc * 100).toFixed(2)}%` : '—', sub: 'Discrimination' },
                    { label: 'Test Pos Rate', value: (testPosRate != null) ? `${(testPosRate * 100).toFixed(1)}%` : '—', sub: 'Class balance' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl p-5 border border-slate-200 text-center shadow-sm">
                        <div className="text-3xl font-black text-slate-900">{stat.value}</div>
                        <div className="text-sm font-semibold text-slate-700 mt-1">{stat.label}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{stat.sub}</div>
                    </div>
                ))}
            </div>

            {/* Section Cards */}
            <h2 className="text-2xl font-bold text-slate-800 mb-8">Workshop Sections</h2>
            <div className="grid md:grid-cols-2 gap-6">
                {SECTIONS.map((section) => {
                    const Icon = section.icon;
                    return (
                        <Link
                            key={section.path}
                            to={section.path}
                            className="group bg-white rounded-xl border border-slate-200 p-6 hover:border-qm-300 hover:shadow-lg hover:shadow-qm-100 transition-all"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center text-white shadow-lg`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{section.tag}</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-qm-700 transition-colors">
                                {section.title}
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {section.description}
                            </p>
                        </Link>
                    );
                })}
            </div>

            {/* Project Overview */}
            <div className="mt-16 bg-gradient-to-br from-qm-950 to-slate-900 rounded-2xl p-8 md:p-12 text-white">
                <h2 className="text-2xl font-bold mb-6">What is Quantum Mind?</h2>
                <div className="grid md:grid-cols-2 gap-8 text-slate-300 text-sm leading-relaxed">
                    <div>
                        <h3 className="text-white font-semibold text-base mb-3">The Problem</h3>
                        <p className="mb-4">
                            Student mental health is in crisis. 1 in 3 college students experience significant anxiety or depression,
                            yet only 36% receive treatment. Traditional screening relies on lengthy clinical interviews that most
                            students never access. By the time a student seeks help, they may already be in crisis.
                        </p>
                        <h3 className="text-white font-semibold text-base mb-3">Our Approach</h3>
                        <p>
                            Quantum Mind uses a smartphone-accessible assessment combining three data modalities — cognitive games,
                            voice analysis, and self-reported surveys — processed through a Variational Quantum Classifier (VQC)
                            to provide real-time mental health risk triage.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold text-base mb-3">Why Quantum?</h3>
                        <p className="mb-4">
                            Mental health is not a single-axis problem. Anxiety, sleep, diet, cognition, and social isolation
                            are deeply entangled — they influence each other in complex, non-linear ways. Quantum computing
                            naturally represents these entangled relationships through qubit superposition and quantum entanglement.
                        </p>
                        <h3 className="text-white font-semibold text-base mb-3">The Hybrid Model</h3>
                        <p>
                            We combine classical ML (LLM-based transcript analysis via Llama 3.1) with quantum ML (VQC risk classification)
                            and biometric AI (Hume voice prosody analysis) to create a comprehensive, multi-modal triage system.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
