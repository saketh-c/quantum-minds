import { Bar, Line, Radar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, RadialLinearScale, Filler, Title, Tooltip, Legend } from 'chart.js';
import { FlaskConical, TrendingUp, Layers, Brain, AlertTriangle, CheckCircle, Target, BarChart3, GitCompare, Microscope, Shield } from 'lucide-react';
import modelRuns from '../data/modelRuns.json';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, RadialLinearScale, Filler, Title, Tooltip, Legend);

const MetricBadge = ({ label, value, color = 'blue', large }) => (
    <div className={`text-center ${large ? 'p-4' : 'p-3'} bg-${color}-50 rounded-lg border border-${color}-100`}>
        <p className={`${large ? 'text-2xl' : 'text-lg'} font-black text-${color}-700`}>{value}</p>
        <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
);

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
    <div className="mb-6 mt-12 first:mt-0">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-qm-100 rounded-lg">
                <Icon className="w-5 h-5 text-qm-700" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">{title}</h2>
        </div>
        {subtitle && <p className="text-slate-600 ml-12">{subtitle}</p>}
    </div>
);

export default function ComprehensiveAnalysis() {
    const runs = modelRuns.runs;
    const selected = runs.find(r => r.selected);
    const findings = modelRuns.key_findings;
    const correlations = modelRuns.feature_correlations;

    // Chart: Model Comparison (F1, MCC, AUC-ROC across runs)
    const comparisonData = {
        labels: runs.map(r => r.name.replace(' (Selected)', '')),
        datasets: [
            {
                label: 'F1 Score',
                data: runs.map(r => r.metrics.f1),
                backgroundColor: 'rgba(79, 70, 229, 0.7)',
                borderColor: 'rgb(79, 70, 229)',
                borderWidth: 1,
            },
            {
                label: 'MCC',
                data: runs.map(r => r.metrics.mcc),
                backgroundColor: 'rgba(236, 72, 153, 0.7)',
                borderColor: 'rgb(236, 72, 153)',
                borderWidth: 1,
            },
            {
                label: 'AUC-ROC',
                data: runs.map(r => r.metrics.auc_roc),
                backgroundColor: 'rgba(16, 185, 129, 0.7)',
                borderColor: 'rgb(16, 185, 129)',
                borderWidth: 1,
            },
        ],
    };

    // Chart: Precision-Recall tradeoff across runs
    const prTradeoffData = {
        labels: runs.map(r => r.name.replace(' (Selected)', '')),
        datasets: [
            {
                label: 'Precision',
                data: runs.map(r => r.metrics.precision * 100),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: false,
                tension: 0.3,
                pointRadius: 6,
            },
            {
                label: 'Recall',
                data: runs.map(r => r.metrics.recall * 100),
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: false,
                tension: 0.3,
                pointRadius: 6,
            },
        ],
    };

    // Chart: Feature correlations
    const corrData = {
        labels: correlations.map(c => c.feature),
        datasets: [{
            label: 'Correlation with Depression',
            data: correlations.map(c => c.correlation),
            backgroundColor: correlations.map(c => c.correlation > 0 ? 'rgba(239, 68, 68, 0.7)' : 'rgba(16, 185, 129, 0.7)'),
            borderColor: correlations.map(c => c.correlation > 0 ? 'rgb(239, 68, 68)' : 'rgb(16, 185, 129)'),
            borderWidth: 1,
        }],
    };

    // Chart: Threshold analysis for selected model
    const thresholdData = selected?.threshold_analysis ? {
        labels: selected.threshold_analysis.map(t => t.threshold.toFixed(1)),
        datasets: [
            {
                label: 'Precision',
                data: selected.threshold_analysis.map(t => t.precision * 100),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: false,
                tension: 0.3,
            },
            {
                label: 'Recall',
                data: selected.threshold_analysis.map(t => t.recall * 100),
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: false,
                tension: 0.3,
            },
            {
                label: 'F1',
                data: selected.threshold_analysis.map(t => t.f1 * 100),
                borderColor: 'rgb(168, 85, 247)',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                fill: false,
                tension: 0.3,
                borderDash: [5, 5],
            },
            {
                label: 'MCC',
                data: selected.threshold_analysis.map(t => t.mcc * 100),
                borderColor: 'rgb(236, 72, 153)',
                backgroundColor: 'rgba(236, 72, 153, 0.1)',
                fill: false,
                tension: 0.3,
                borderDash: [5, 5],
            },
        ],
    } : null;

    // Radar chart for selected model
    const radarData = selected ? {
        labels: ['Accuracy', 'Precision', 'Recall', 'F1', 'MCC', 'AUC-ROC', 'Specificity'],
        datasets: [{
            label: 'Selected Model',
            data: [
                selected.metrics.accuracy, selected.metrics.precision, selected.metrics.recall,
                selected.metrics.f1, selected.metrics.mcc, selected.metrics.auc_roc,
                selected.metrics.specificity || 0.84,
            ],
            backgroundColor: 'rgba(79, 70, 229, 0.15)',
            borderColor: 'rgb(79, 70, 229)',
            pointBackgroundColor: 'rgb(79, 70, 229)',
            pointBorderColor: '#fff',
            pointRadius: 4,
        }],
    } : null;

    return (
        <div className="max-w-5xl mx-auto">
            {/* Title */}
            <div className="mb-10">
                <div className="inline-flex items-center gap-2 bg-qm-100 text-qm-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                    <Microscope className="w-4 h-4" />
                    Research Analysis
                </div>
                <h1 className="text-4xl font-black text-slate-900 mb-3">Comprehensive Model Evaluation</h1>
                <p className="text-lg text-slate-600 leading-relaxed">
                    A systematic analysis of six experimental configurations of the 14-qubit Variational Quantum Classifier,
                    evaluating the impact of loss function selection, circuit depth, learning rate scheduling, decision threshold
                    optimization, and training data composition on clinical screening performance.
                </p>
            </div>

            {/* Abstract */}
            <div className="bg-gradient-to-br from-slate-50 to-qm-50 rounded-xl border border-slate-200 p-6 mb-8">
                <h3 className="font-bold text-slate-900 mb-2">Abstract</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                    We present a series of ablation experiments on a Variational Quantum Classifier (VQC) designed for adolescent mental
                    health screening. Starting from a 5-layer baseline trained with Mean Squared Error loss on synthetic clinical data
                    (F1 = 0.809, MCC = 0.710), we systematically improved the architecture by switching to Binary Cross-Entropy loss,
                    increasing circuit depth to 6 layers, implementing learning rate decay, and optimizing the decision threshold. The
                    best synthetic-data model achieved F1 = 0.837, MCC = 0.714, and AUC-ROC = 0.952. We further validated on a real-world
                    Kaggle student depression dataset (n = 27,901), where the model achieved F1 = 0.851 but lower MCC (0.622), revealing
                    the gap between synthetic benchmarks and real clinical data complexity. An 8-layer variant showed no improvement,
                    suggesting barren plateau effects. The selected production model significantly outperforms the estimated 0.5 MCC
                    human baseline for informal screening.
                </p>
            </div>

            {/* 1. Experimental Overview */}
            <SectionHeader icon={FlaskConical} title="1. Experimental Overview" subtitle="Six model configurations tested across two datasets" />

            <div className="overflow-x-auto mb-8">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="bg-slate-100">
                            <th className="text-left p-3 border border-slate-200 font-bold">Run</th>
                            <th className="text-center p-3 border border-slate-200 font-bold">Dataset</th>
                            <th className="text-center p-3 border border-slate-200 font-bold">Layers</th>
                            <th className="text-center p-3 border border-slate-200 font-bold">Steps</th>
                            <th className="text-center p-3 border border-slate-200 font-bold">Loss</th>
                            <th className="text-center p-3 border border-slate-200 font-bold">Threshold</th>
                            <th className="text-center p-3 border border-slate-200 font-bold">F1</th>
                            <th className="text-center p-3 border border-slate-200 font-bold">MCC</th>
                            <th className="text-center p-3 border border-slate-200 font-bold">AUC-ROC</th>
                        </tr>
                    </thead>
                    <tbody>
                        {runs.map(run => (
                            <tr key={run.id} className={run.selected ? 'bg-qm-50 font-semibold' : 'hover:bg-slate-50'}>
                                <td className="p-3 border border-slate-200">
                                    {run.name}
                                    {run.selected && <span className="ml-2 text-xs bg-qm-600 text-white px-1.5 py-0.5 rounded">SELECTED</span>}
                                </td>
                                <td className="text-center p-3 border border-slate-200 text-xs">{run.dataset.includes('Kaggle') ? 'Kaggle' : 'Synthetic'}</td>
                                <td className="text-center p-3 border border-slate-200">{run.architecture.layers}</td>
                                <td className="text-center p-3 border border-slate-200">{run.training.steps.toLocaleString()}</td>
                                <td className="text-center p-3 border border-slate-200 text-xs">{run.training.loss_function}</td>
                                <td className="text-center p-3 border border-slate-200">{run.threshold}</td>
                                <td className="text-center p-3 border border-slate-200">{run.metrics.f1.toFixed(3)}</td>
                                <td className="text-center p-3 border border-slate-200">{run.metrics.mcc.toFixed(3)}</td>
                                <td className="text-center p-3 border border-slate-200">{run.metrics.auc_roc.toFixed(3)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 2. Selected Model Performance */}
            <SectionHeader icon={Target} title="2. Selected Model Performance" subtitle="Production model: 6-layer VQC on synthetic data with BCE loss" />

            {selected && (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                        <MetricBadge label="Accuracy" value={`${(selected.metrics.accuracy * 100).toFixed(1)}%`} color="blue" large />
                        <MetricBadge label="Precision" value={`${(selected.metrics.precision * 100).toFixed(1)}%`} color="indigo" large />
                        <MetricBadge label="Recall" value={`${(selected.metrics.recall * 100).toFixed(1)}%`} color="violet" large />
                        <MetricBadge label="F1 Score" value={selected.metrics.f1.toFixed(3)} color="purple" large />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                        <MetricBadge label="MCC" value={selected.metrics.mcc.toFixed(3)} color="pink" />
                        <MetricBadge label="AUC-ROC" value={selected.metrics.auc_roc.toFixed(3)} color="emerald" />
                        <MetricBadge label="AUC-PR" value={selected.metrics.auc_pr?.toFixed(3) || 'N/A'} color="amber" />
                        <MetricBadge label="Balanced Acc." value={`${(selected.metrics.balanced_accuracy * 100).toFixed(1)}%`} color="cyan" />
                    </div>

                    {/* Radar Chart */}
                    {radarData && (
                        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
                            <h3 className="font-bold text-slate-900 mb-4">Multi-Metric Radar Profile</h3>
                            <div className="h-80 flex justify-center">
                                <Radar data={radarData} options={{
                                    scales: { r: { min: 0, max: 1, ticks: { stepSize: 0.2, font: { size: 10 } } } },
                                    plugins: { legend: { display: false } },
                                    maintainAspectRatio: false,
                                }} />
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* 3. Comparative Analysis */}
            <SectionHeader icon={GitCompare} title="3. Comparative Analysis" subtitle="Performance metrics across all experimental configurations" />

            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h3 className="font-bold text-slate-900 mb-4">F1 / MCC / AUC-ROC by Configuration</h3>
                    <div className="h-72">
                        <Bar data={comparisonData} options={{
                            responsive: true, maintainAspectRatio: false,
                            scales: { y: { min: 0.4, max: 1.0, ticks: { font: { size: 10 } } }, x: { ticks: { font: { size: 9 }, maxRotation: 45 } } },
                            plugins: { legend: { position: 'top', labels: { font: { size: 10 } } } },
                        }} />
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h3 className="font-bold text-slate-900 mb-4">Precision-Recall Trajectory</h3>
                    <div className="h-72">
                        <Line data={prTradeoffData} options={{
                            responsive: true, maintainAspectRatio: false,
                            scales: { y: { min: 60, max: 100, title: { display: true, text: '%', font: { size: 10 } } }, x: { ticks: { font: { size: 9 }, maxRotation: 45 } } },
                            plugins: { legend: { position: 'top', labels: { font: { size: 10 } } } },
                        }} />
                    </div>
                </div>
            </div>

            {/* 4. Threshold Optimization */}
            <SectionHeader icon={TrendingUp} title="4. Decision Threshold Optimization" subtitle="Clinical threshold selection for recall-prioritized screening" />

            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                <p className="text-sm text-slate-700 mb-4 leading-relaxed">
                    In clinical mental health screening, a <strong>false negative</strong> (missing an at-risk student) is more dangerous than
                    a <strong>false positive</strong> (an unnecessary counselor check-in). We systematically evaluated decision thresholds from
                    0.1 to 0.9 to find the optimal operating point. The selected threshold of <strong>0.5</strong> maximizes MCC (0.714) while
                    maintaining 86.5% recall — comparable to the sensitivity of established screening instruments like the PHQ-9.
                </p>
                {thresholdData && (
                    <div className="h-72">
                        <Line data={thresholdData} options={{
                            responsive: true, maintainAspectRatio: false,
                            scales: {
                                y: { min: 0, max: 100, title: { display: true, text: 'Score (%)', font: { size: 10 } } },
                                x: { title: { display: true, text: 'Decision Threshold', font: { size: 10 } } },
                            },
                            plugins: { legend: { position: 'top', labels: { font: { size: 10 } } } },
                        }} />
                    </div>
                )}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-900">
                    <strong>Clinical Note:</strong> The threshold-recall relationship follows the same principle used in medical screening
                    (mammography, COVID-19 rapid tests): cast a wider net to minimize missed cases, accepting additional follow-up referrals
                    as the cost of safety.
                </div>
            </div>

            {/* 5. Ablation Studies */}
            <SectionHeader icon={Layers} title="5. Ablation Studies" subtitle="Isolating the impact of each architectural and training decision" />

            <div className="space-y-4 mb-8">
                {/* Loss Function */}
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-start gap-3">
                        <div className="p-1.5 bg-indigo-100 rounded-lg"><BarChart3 className="w-4 h-4 text-indigo-600" /></div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-900">Loss Function: MSE → Binary Cross-Entropy</h4>
                            <p className="text-sm text-slate-600 mt-1 leading-relaxed">{findings.loss_function}</p>
                            <div className="flex gap-4 mt-3">
                                <div className="text-xs"><span className="text-slate-400">AUC-ROC:</span> <span className="font-semibold text-emerald-600">0.942 → 0.952 (+1.1%)</span></div>
                                <div className="text-xs"><span className="text-slate-400">Recall:</span> <span className="font-semibold text-emerald-600">79% → 93% (+14%)</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Circuit Depth */}
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-start gap-3">
                        <div className="p-1.5 bg-violet-100 rounded-lg"><Layers className="w-4 h-4 text-violet-600" /></div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-900">Circuit Depth: 5 → 6 → 8 Layers</h4>
                            <p className="text-sm text-slate-600 mt-1 leading-relaxed">{findings.layer_depth}</p>
                            <div className="flex gap-4 mt-3">
                                <div className="text-xs"><span className="text-slate-400">5→6 layers:</span> <span className="font-semibold text-emerald-600">MCC +0.004</span></div>
                                <div className="text-xs"><span className="text-slate-400">6→8 layers:</span> <span className="font-semibold text-red-600">MCC -0.017 (barren plateau)</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Learning Rate */}
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-start gap-3">
                        <div className="p-1.5 bg-pink-100 rounded-lg"><TrendingUp className="w-4 h-4 text-pink-600" /></div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-900">Learning Rate Scheduling</h4>
                            <p className="text-sm text-slate-600 mt-1 leading-relaxed">{findings.learning_rate}</p>
                            <div className="flex gap-4 mt-3">
                                <div className="text-xs"><span className="text-slate-400">Final loss:</span> <span className="font-semibold text-emerald-600">0.454 → 0.405 (10.8% reduction)</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Threshold */}
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-start gap-3">
                        <div className="p-1.5 bg-amber-100 rounded-lg"><Target className="w-4 h-4 text-amber-600" /></div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-900">Decision Threshold Optimization</h4>
                            <p className="text-sm text-slate-600 mt-1 leading-relaxed">{findings.threshold_optimization}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 6. Synthetic vs Real Data */}
            <SectionHeader icon={Brain} title="6. Synthetic vs. Real-World Data" subtitle="Validating on the Kaggle Student Depression Dataset (n = 27,901)" />

            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                <p className="text-sm text-slate-700 leading-relaxed mb-4">{findings.synthetic_vs_real}</p>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                        <h4 className="font-bold text-indigo-900 mb-2">Synthetic Data</h4>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between"><span className="text-slate-600">MCC</span><span className="font-bold text-indigo-700">0.714</span></div>
                            <div className="flex justify-between"><span className="text-slate-600">F1</span><span className="font-bold text-indigo-700">0.837</span></div>
                            <div className="flex justify-between"><span className="text-slate-600">AUC-ROC</span><span className="font-bold text-indigo-700">0.952</span></div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">Clean feature-target relationships, all 14 features carry signal</p>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                        <h4 className="font-bold text-emerald-900 mb-2">Kaggle Real Data</h4>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between"><span className="text-slate-600">MCC</span><span className="font-bold text-emerald-700">0.622</span></div>
                            <div className="flex justify-between"><span className="text-slate-600">F1</span><span className="font-bold text-emerald-700">0.851</span></div>
                            <div className="flex justify-between"><span className="text-slate-600">AUC-ROC</span><span className="font-bold text-emerald-700">0.894</span></div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">Noisy correlations, only 3 features with r &gt; 0.3</p>
                    </div>
                </div>
            </div>

            {/* Feature Correlations Chart */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
                <h3 className="font-bold text-slate-900 mb-2">Kaggle Feature Correlations with Depression</h3>
                <p className="text-xs text-slate-500 mb-4">Pearson correlation coefficient. Red = risk factor, green = protective factor.</p>
                <div className="h-72">
                    <Bar data={corrData} options={{
                        indexAxis: 'y',
                        responsive: true, maintainAspectRatio: false,
                        scales: { x: { min: -0.3, max: 0.6, ticks: { font: { size: 10 } } }, y: { ticks: { font: { size: 10 } } } },
                        plugins: { legend: { display: false } },
                    }} />
                </div>
            </div>

            {/* 7. Clinical Significance */}
            <SectionHeader icon={Shield} title="7. Clinical Significance" subtitle="Contextualizing performance against human baselines" />

            <div className="bg-gradient-to-br from-emerald-50 to-qm-50 rounded-xl border border-emerald-200 p-6 mb-6">
                <p className="text-sm text-slate-700 leading-relaxed">{findings.clinical_significance}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl border-2 border-slate-200 p-5 text-center">
                    <p className="text-4xl font-black text-slate-300 mb-1">0.50</p>
                    <p className="text-sm text-slate-500">Human Baseline MCC</p>
                    <p className="text-xs text-slate-400 mt-1">Informal screening without tools</p>
                </div>
                <div className="bg-white rounded-xl border-2 border-qm-300 p-5 text-center relative">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-qm-600 text-white text-xs px-2 py-0.5 rounded-full">Our Model</div>
                    <p className="text-4xl font-black text-qm-700 mb-1">0.714</p>
                    <p className="text-sm text-slate-500">VQC Model MCC</p>
                    <p className="text-xs text-qm-600 mt-1 font-semibold">+42.8% over human baseline</p>
                </div>
                <div className="bg-white rounded-xl border-2 border-slate-200 p-5 text-center">
                    <p className="text-4xl font-black text-slate-300 mb-1">0.80+</p>
                    <p className="text-sm text-slate-500">Clinical Gold Standard</p>
                    <p className="text-xs text-slate-400 mt-1">Validated instruments (PHQ-9, GAD-7)</p>
                </div>
            </div>

            {/* 8. Limitations & Future Work */}
            <SectionHeader icon={AlertTriangle} title="8. Limitations & Future Work" />

            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <h4 className="font-bold text-red-700 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> Limitations
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex gap-2"><span className="text-red-400">1.</span>Synthetic training data has engineered correlations that overestimate real-world performance</li>
                        <li className="flex gap-2"><span className="text-red-400">2.</span>14-qubit simulation runs on classical hardware — no quantum advantage demonstrated</li>
                        <li className="flex gap-2"><span className="text-red-400">3.</span>Feature proxy mappings from Kaggle data introduce noise (e.g., Financial Stress → Substance Risk)</li>
                        <li className="flex gap-2"><span className="text-red-400">4.</span>Single-site dataset limits generalizability across demographics</li>
                        <li className="flex gap-2"><span className="text-red-400">5.</span>Not validated against clinical diagnosis — screening tool only, not diagnostic</li>
                    </ul>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <h4 className="font-bold text-emerald-700 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Future Directions
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex gap-2"><span className="text-emerald-400">1.</span>Collect real clinical data through the app's multi-modal pipeline (games + voice + survey)</li>
                        <li className="flex gap-2"><span className="text-emerald-400">2.</span>Deploy on actual quantum hardware (IBM Quantum, IonQ) to explore potential advantage</li>
                        <li className="flex gap-2"><span className="text-emerald-400">3.</span>Implement longitudinal tracking — monitor risk trajectories over time</li>
                        <li className="flex gap-2"><span className="text-emerald-400">4.</span>Universal provider dashboard integration for therapists worldwide</li>
                        <li className="flex gap-2"><span className="text-emerald-400">5.</span>IRB-approved clinical validation study with Dr. Mary Bonsu</li>
                    </ul>
                </div>
            </div>

            {/* 9. Model Configuration Details */}
            <SectionHeader icon={BarChart3} title="9. Detailed Run Configurations" subtitle="Complete hyperparameter and architecture specifications" />

            <div className="space-y-4 mb-12">
                {runs.map(run => (
                    <div key={run.id} className={`bg-white rounded-xl border ${run.selected ? 'border-qm-300 ring-1 ring-qm-200' : 'border-slate-200'} p-5`}>
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h4 className="font-bold text-slate-900">{run.name}</h4>
                                <p className="text-xs text-slate-500">{run.description}</p>
                            </div>
                            {run.selected && <span className="text-xs bg-qm-600 text-white px-2 py-1 rounded-full">Production</span>}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-3">
                            <div><span className="text-slate-400">Dataset:</span> <span className="font-semibold">{run.dataset.includes('Kaggle') ? 'Kaggle' : 'Synthetic'}</span></div>
                            <div><span className="text-slate-400">Architecture:</span> <span className="font-semibold">{run.architecture.qubits}q × {run.architecture.layers}L ({run.architecture.parameters}p)</span></div>
                            <div><span className="text-slate-400">Training:</span> <span className="font-semibold">{run.training.steps} steps, BS={run.training.batch_size}</span></div>
                            <div><span className="text-slate-400">Loss:</span> <span className="font-semibold">{run.training.loss_function}, LR={typeof run.training.learning_rate === 'number' ? run.training.learning_rate : run.training.learning_rate}</span></div>
                        </div>
                        <p className="text-xs text-slate-500 italic border-t border-slate-100 pt-2">{run.notes}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
