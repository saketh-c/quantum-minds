import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { BarChart3, Atom, TrendingUp, Award } from 'lucide-react';
import evalData from '../data/evaluationResults.json';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

function StatCard({ label, value, sub, color = 'qm' }) {
    const colorMap = {
        qm: 'from-qm-500 to-qm-700 shadow-qm-500/30',
        emerald: 'from-emerald-500 to-emerald-700 shadow-emerald-500/30',
        violet: 'from-violet-500 to-violet-700 shadow-violet-500/30',
        amber: 'from-amber-500 to-amber-700 shadow-amber-500/30',
        rose: 'from-rose-500 to-rose-700 shadow-rose-500/30',
        blue: 'from-blue-500 to-blue-700 shadow-blue-500/30',
        indigo: 'from-indigo-500 to-indigo-700 shadow-indigo-500/30',
        pink: 'from-pink-500 to-pink-700 shadow-pink-500/30',
    };
    return (
        <div className={`bg-gradient-to-br ${colorMap[color] || colorMap.qm} rounded-xl p-4 text-white shadow-lg`}>
            <div className="text-xs font-bold uppercase tracking-wider opacity-80">{label}</div>
            <div className="text-2xl font-black mt-1">{value}</div>
            {sub && <div className="text-xs opacity-70 mt-0.5">{sub}</div>}
        </div>
    );
}

const pct = (v) => typeof v === 'number' ? `${(v * 100).toFixed(2)}%` : '—';

export default function PosterCenter() {
    const m = evalData?.metrics;
    const tm = evalData?.train_metrics;
    const ds = evalData?.dataset;
    const cfg = evalData?.model_config;
    const fi = evalData?.feature_importance;
    const pd = evalData?.probability_distribution;

    const chartOpts = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { grid: { display: false } }, y: { grid: { color: '#f1f5f9' }, beginAtZero: true } },
    };

    // ROC Curve
    const rocChart = evalData?.roc_curve ? {
        datasets: [
            {
                label: `ROC (AUC=${m?.auc_roc?.toFixed(4)})`,
                data: evalData.roc_curve.fpr.map((fpr, i) => ({ x: fpr, y: evalData.roc_curve.tpr[i] })).filter((_, i) => i % 5 === 0),
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99,102,241,0.1)',
                fill: true, tension: 0.3, pointRadius: 0,
            },

        ],
    } : null;

    // PR Curve
    const prChart = evalData?.pr_curve ? {
        labels: evalData.pr_curve.recall.map(v => v.toFixed(3)),
        datasets: [{
            label: `PR (AUC=${m?.auc_pr?.toFixed(4)})`,
            data: evalData.pr_curve.precision,
            borderColor: '#ec4899',
            backgroundColor: 'rgba(236,72,153,0.1)',
            fill: true, tension: 0.3, pointRadius: 0,
        }],
    } : null;

    // Feature importance
    const featureChart = fi ? {
        labels: fi.map(f => f.feature_name),
        datasets: [{
            label: 'Importance',
            data: fi.map(f => f.importance),
            backgroundColor: fi.map((_, i) => `hsl(${220 + i * 10}, 70%, ${50 + i * 2}%)`),
            borderRadius: 6,
        }],
    } : null;

    // Training loss
    const lossChart = evalData?.training_history ? {
        labels: evalData.training_history.steps,
        datasets: [{
            label: 'Training Loss',
            data: evalData.training_history.losses,
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239,68,68,0.08)',
            fill: true, tension: 0.4, pointRadius: 0,
        }],
    } : null;

    // Risk tier doughnut
    const tierChart = pd?.risk_tiers ? {
        labels: Object.keys(pd.risk_tiers),
        datasets: [{
            data: Object.values(pd.risk_tiers),
            backgroundColor: ['#22c55e', '#f59e0b', '#f97316', '#ef4444'],
            borderWidth: 0,
        }],
    } : null;

    // Probability histogram
    const histChart = pd?.histogram ? {
        labels: pd.histogram.map(b => b.bin_start.toFixed(2)),
        datasets: [{
            label: 'Count',
            data: pd.histogram.map(b => b.count),
            backgroundColor: 'rgba(99,102,241,0.5)',
            borderRadius: 4,
        }],
    } : null;

    const cm = m?.confusion_matrix;

    return (
        <div className="poster-panel space-y-8">
            {/* ── POSTER TITLE ── */}
            <div className="text-center bg-gradient-to-br from-qm-950 via-slate-900 to-qm-900 rounded-2xl p-8 text-white">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                    <Atom className="w-3 h-3" /> Science Fair 2026
                </div>
                <h1 className="text-2xl md:text-3xl font-black leading-tight mb-3">
                    Quantum Mind
                </h1>
                <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed mb-2">
                    Smartphone-Integrated Psychometric and Biometric Triage Analysis System
                    Utilizing Hybrid Quantum-Classical Machine Learning
                </p>
                <div className="flex items-center justify-center gap-6 mt-4 text-xs text-slate-400">
                    <span>{cfg?.qubits ?? 14} Qubits</span>
                    <span className="w-1 h-1 bg-slate-500 rounded-full" />
                    <span>{cfg?.total_parameters ?? '—'} Parameters</span>
                    <span className="w-1 h-1 bg-slate-500 rounded-full" />
                    <span>{ds?.total_samples?.toLocaleString() ?? '—'} Samples</span>
                    <span className="w-1 h-1 bg-slate-500 rounded-full" />
                    <span>{cfg?.training_steps ?? '—'} Training Steps</span>
                </div>
            </div>

            {/* ── KEY METRICS ── */}
            <section>
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">
                    <Award className="w-5 h-5 text-amber-500" /> Key Results
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <StatCard label="Accuracy" value={pct(m?.accuracy)} sub="Test set" color="qm" />
                    <StatCard label="Precision" value={pct(m?.precision)} sub="PPV" color="emerald" />
                    <StatCard label="Recall" value={pct(m?.recall)} sub="Sensitivity" color="amber" />
                    <StatCard label="F1 Score" value={pct(m?.f1_score)} sub="Harmonic mean" color="rose" />
                    <StatCard label="AUC-ROC" value={pct(m?.auc_roc)} sub="Discrimination" color="indigo" />
                    <StatCard label="AUC-PR" value={pct(m?.auc_pr)} sub="Imbalance-aware" color="pink" />
                    <StatCard label="MCC" value={m?.mcc?.toFixed(4) ?? '—'} sub="Best single metric" color="violet" />
                    <StatCard label="Balanced Acc." value={pct(m?.balanced_accuracy)} sub="Mean sens/spec" color="blue" />
                </div>
            </section>

            {/* ── CONFUSION MATRIX ── */}
            {cm && (
                <section className="bg-white border border-slate-200 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Confusion Matrix</h2>
                    <div className="max-w-sm mx-auto">
                        <div className="text-center text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Predicted</div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                            <div />
                            <div className="text-xs font-bold text-slate-500">No Risk</div>
                            <div className="text-xs font-bold text-slate-500">Risk</div>
                            <div className="text-xs font-bold text-slate-500 flex items-center justify-end pr-2">No Risk</div>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <div className="text-xl font-black text-green-700">{cm.tn}</div>
                                <div className="text-[10px] text-green-600">TN</div>
                            </div>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <div className="text-xl font-black text-red-700">{cm.fp}</div>
                                <div className="text-[10px] text-red-600">FP</div>
                            </div>
                            <div className="text-xs font-bold text-slate-500 flex items-center justify-end pr-2">Risk</div>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <div className="text-xl font-black text-red-700">{cm.fn}</div>
                                <div className="text-[10px] text-red-600">FN</div>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <div className="text-xl font-black text-green-700">{cm.tp}</div>
                                <div className="text-[10px] text-green-600">TP</div>
                            </div>
                        </div>
                        <div className="text-xs text-slate-400 text-center mt-3">
                            {cm.tn + cm.fp + cm.fn + cm.tp} samples · {cm.fp + cm.fn} misclassified · Specificity {pct(m?.specificity)}
                        </div>
                    </div>
                </section>
            )}

            {/* ── CHARTS ROW 1: ROC + PR ── */}
            <div className="grid md:grid-cols-2 gap-4">
                {rocChart && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-5">
                        <h3 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-indigo-500" /> ROC Curve
                        </h3>
                        <div className="h-56">
                            <Line data={rocChart} options={{
                                ...chartOpts,
                                plugins: { ...chartOpts.plugins, legend: { display: true, position: 'bottom', labels: { font: { size: 10 }, usePointStyle: true } } },
                                scales: { x: { type: 'linear', min: 0, max: 1, title: { display: true, text: 'FPR', font: { size: 10 } }, grid: { display: false } }, y: { title: { display: true, text: 'TPR', font: { size: 10 } }, min: 0, max: 1, grid: { color: '#f1f5f9' } } },
                            }} />
                        </div>
                    </div>
                )}
                {prChart && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-5">
                        <h3 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-pink-500" /> Precision-Recall Curve
                        </h3>
                        <div className="h-56">
                            <Line data={prChart} options={{
                                ...chartOpts,
                                plugins: { ...chartOpts.plugins, legend: { display: true, position: 'bottom', labels: { font: { size: 10 }, usePointStyle: true } } },
                                scales: { x: { title: { display: true, text: 'Recall', font: { size: 10 } }, grid: { display: false } }, y: { title: { display: true, text: 'Precision', font: { size: 10 } }, min: 0, max: 1, grid: { color: '#f1f5f9' } } },
                            }} />
                        </div>
                    </div>
                )}
            </div>

            {/* ── CHARTS ROW 2: Feature Importance + Training Loss ── */}
            <div className="grid md:grid-cols-2 gap-4">
                {featureChart && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-5">
                        <h3 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-qm-500" /> Feature Importance
                        </h3>
                        <div className="h-56">
                            <Bar data={featureChart} options={{
                                ...chartOpts,
                                indexAxis: 'y',
                                scales: { x: { title: { display: true, text: 'Accuracy Drop', font: { size: 10 } } }, y: { grid: { display: false }, ticks: { font: { size: 9 } } } },
                            }} />
                        </div>
                    </div>
                )}
                {lossChart && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-5">
                        <h3 className="font-bold text-sm text-slate-800 mb-3">Training Loss Curve</h3>
                        <div className="h-56">
                            <Line data={lossChart} options={{
                                ...chartOpts,
                                scales: { x: { title: { display: true, text: 'Step', font: { size: 10 } }, grid: { display: false } }, y: { title: { display: true, text: 'MSE', font: { size: 10 } }, grid: { color: '#f1f5f9' } } },
                            }} />
                        </div>
                    </div>
                )}
            </div>

            {/* ── CHARTS ROW 3: Risk Tiers + Probability Distribution ── */}
            <div className="grid md:grid-cols-2 gap-4">
                {tierChart && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-5">
                        <h3 className="font-bold text-sm text-slate-800 mb-3">Risk Tier Distribution</h3>
                        <div className="h-56 flex items-center justify-center">
                            <Doughnut data={tierChart} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { font: { size: 10 } } } } }} />
                        </div>
                    </div>
                )}
                {histChart && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-5">
                        <h3 className="font-bold text-sm text-slate-800 mb-3">Probability Distribution</h3>
                        <div className="h-56">
                            <Bar data={histChart} options={{
                                ...chartOpts,
                                scales: { x: { title: { display: true, text: 'Risk Probability', font: { size: 10 } }, grid: { display: false } }, y: { title: { display: true, text: 'Count', font: { size: 10 } }, grid: { color: '#f1f5f9' } } },
                            }} />
                        </div>
                    </div>
                )}
            </div>

            {/* ── TRAIN vs TEST ── */}
            {tm && (
                <section className="bg-white border border-slate-200 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Overfitting Check — Train vs Test</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left border-b border-slate-200">
                                    <th className="py-2 font-bold text-slate-500">Metric</th>
                                    <th className="py-2 font-bold text-qm-600">Test</th>
                                    <th className="py-2 font-bold text-slate-500">Train</th>
                                    <th className="py-2 font-bold text-slate-500">Gap</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    ['Accuracy', 'accuracy'],
                                    ['Precision', 'precision'],
                                    ['Recall', 'recall'],
                                    ['F1 Score', 'f1_score'],
                                    ['AUC-ROC', 'auc_roc'],
                                    ['MCC', 'mcc'],
                                ].map(([label, key]) => {
                                    const tv = m?.[key] ?? 0;
                                    const trv = tm?.[key] ?? 0;
                                    const gap = Math.abs(tv - trv);
                                    const gapColor = gap > 0.05 ? 'text-red-600' : gap > 0.02 ? 'text-amber-600' : 'text-green-600';
                                    return (
                                        <tr key={key} className="border-b border-slate-100">
                                            <td className="py-2 font-medium text-slate-700">{label}</td>
                                            <td className="py-2 font-bold text-qm-700">{pct(tv)}</td>
                                            <td className="py-2 text-slate-600">{pct(trv)}</td>
                                            <td className={`py-2 font-bold ${gapColor}`}>{(gap * 100).toFixed(2)}%</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="text-xs text-slate-500 mt-3">
                        Small gaps (green) indicate good generalization. Large gaps (red) suggest overfitting.
                    </div>
                </section>
            )}

            {/* ── DATASET SUMMARY ── */}
            {ds && (
                <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Dataset Summary</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className="bg-white rounded-xl p-3 border border-slate-200 text-center">
                            <div className="text-2xl font-black text-slate-900">{ds.total_samples?.toLocaleString()}</div>
                            <div className="text-xs text-slate-500">Total Samples</div>
                        </div>
                        <div className="bg-white rounded-xl p-3 border border-slate-200 text-center">
                            <div className="text-2xl font-black text-slate-900">{ds.train_samples?.toLocaleString()}</div>
                            <div className="text-xs text-slate-500">Train (80%)</div>
                        </div>
                        <div className="bg-white rounded-xl p-3 border border-slate-200 text-center">
                            <div className="text-2xl font-black text-slate-900">{ds.test_samples?.toLocaleString()}</div>
                            <div className="text-xs text-slate-500">Test (20%)</div>
                        </div>
                        <div className="bg-white rounded-xl p-3 border border-slate-200 text-center">
                            <div className="text-2xl font-black text-slate-900">{ds.test_positive_rate != null ? `${(ds.test_positive_rate * 100).toFixed(1)}%` : '—'}</div>
                            <div className="text-xs text-slate-500">Positive Rate</div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
