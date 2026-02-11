import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { BarChart3, CheckCircle, TrendingUp } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

import evalData from '../data/evaluationResults.json';

const COLOR_CLASS = {
    blue: 'text-blue-600',
    indigo: 'text-indigo-600',
    violet: 'text-violet-600',
    purple: 'text-purple-600',
    pink: 'text-pink-600',
    red: 'text-red-600',
    emerald: 'text-emerald-600',
    amber: 'text-amber-600',
    slate: 'text-slate-700',
};

function MetricCard({ label, value, percentage, color = 'blue', description }) {
    const cls = COLOR_CLASS[color] || COLOR_CLASS.blue;
    const safeVal = (typeof value === 'number' && Number.isFinite(value)) ? value : 0;
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{label}</div>
            <div className={`text-3xl font-black ${cls}`}>
                {percentage ? `${(safeVal * 100).toFixed(2)}%` : safeVal.toFixed(4)}
            </div>
            {description && <div className="text-xs text-slate-500 mt-2">{description}</div>}
        </div>
    );
}

export default function Evaluation() {
    const data = evalData;
    const m = data?.metrics;
    const tm = data?.train_metrics;
    const ds = data?.dataset;

    if (!data || !m) {
        return (
            <div className="text-center py-20">
                <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-700 mb-2">No evaluation data found</h2>
                <p className="text-slate-500 mb-4">Run the evaluation script to generate metrics:</p>
                <code className="bg-slate-100 px-4 py-2 rounded-lg text-sm font-mono">python backend/evaluate_model.py</code>
            </div>
        );
    }

    const cm = m.confusion_matrix;
    const testPosRate = ds?.test_samples ? (ds.test_positive / ds.test_samples) : null;
    const testNegRate = ds?.test_samples ? (ds.test_negative / ds.test_samples) : null;

    // ROC Curve chart
    const rocChart = data.roc_curve ? {
        labels: data.roc_curve.fpr.map(v => v.toFixed(3)),
        datasets: [
            {
                label: `ROC Curve (AUC = ${m.auc_roc.toFixed(4)})`,
                data: data.roc_curve.tpr,
                borderColor: '#4c6ef5',
                backgroundColor: 'rgba(76, 110, 245, 0.1)',
                fill: true,
                tension: 0.3,
                pointRadius: 0
            },
            {
                label: 'Random (AUC = 0.5)',
                data: data.roc_curve.fpr.map((_, i) => data.roc_curve.fpr[i]),
                borderColor: '#cbd5e1',
                borderDash: [5, 5],
                pointRadius: 0,
                fill: false
            }
        ]
    } : null;

    // PR Curve chart
    const prChart = data.pr_curve ? {
        labels: data.pr_curve.recall.map(v => v.toFixed(3)),
        datasets: [{
            label: `PR Curve (AUC = ${m.auc_pr.toFixed(4)})`,
            data: data.pr_curve.precision,
            borderColor: '#e64980',
            backgroundColor: 'rgba(230, 73, 128, 0.1)',
            fill: true,
            tension: 0.3,
            pointRadius: 0
        }]
    } : null;

    // Threshold analysis chart
    const thresholdChart = data.threshold_analysis ? {
        labels: data.threshold_analysis.map(t => t.threshold.toFixed(1)),
        datasets: [
            { label: 'Accuracy', data: data.threshold_analysis.map(t => t.accuracy), borderColor: '#4c6ef5', tension: 0.3, pointRadius: 4 },
            { label: 'Precision', data: data.threshold_analysis.map(t => t.precision), borderColor: '#37b24d', tension: 0.3, pointRadius: 4 },
            { label: 'Recall', data: data.threshold_analysis.map(t => t.recall), borderColor: '#f59f00', tension: 0.3, pointRadius: 4 },
            { label: 'F1 Score', data: data.threshold_analysis.map(t => t.f1), borderColor: '#e64980', tension: 0.3, pointRadius: 4 },
        ]
    } : null;

    // Feature importance chart
    const featureChart = data.feature_importance ? {
        labels: data.feature_importance.map(f => f.feature_name),
        datasets: [{
            label: 'Importance (Accuracy Drop)',
            data: data.feature_importance.map(f => f.importance),
            backgroundColor: data.feature_importance.map((_, i) =>
                `hsl(${220 + i * 10}, 70%, ${50 + i * 2}%)`
            ),
            borderRadius: 6
        }]
    } : null;

    // Risk tier distribution
    const tierChart = data.probability_distribution?.risk_tiers ? {
        labels: Object.keys(data.probability_distribution.risk_tiers),
        datasets: [{
            data: Object.values(data.probability_distribution.risk_tiers),
            backgroundColor: ['#37b24d', '#f59f00', '#fd7e14', '#e03131'],
            borderWidth: 0,
        }]
    } : null;

    // Probability histogram
    const histChart = data.probability_distribution?.histogram ? {
        labels: data.probability_distribution.histogram.map(b => b.bin_start.toFixed(2)),
        datasets: [{
            label: 'Sample Count',
            data: data.probability_distribution.histogram.map(b => b.count),
            backgroundColor: 'rgba(76, 110, 245, 0.6)',
            borderRadius: 4
        }]
    } : null;

    // Training history
    const trainingChart = data.training_history ? {
        labels: data.training_history.steps,
        datasets: [{
            label: 'Training Loss (MSE)',
            data: data.training_history.losses,
            borderColor: '#e64980',
            backgroundColor: 'rgba(230, 73, 128, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 0
        }]
    } : null;

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top', labels: { font: { size: 11 }, usePointStyle: true } } },
        scales: { x: { grid: { display: false } }, y: { grid: { color: '#f1f5f9' }, beginAtZero: true } }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 mb-2">Model Evaluation</h1>
                <p className="text-slate-600">Comprehensive performance analysis of the 14-qubit Variational Quantum Classifier.</p>
            </div>

            {/* Model Config Summary */}
            {data.model_config && (
                <div className="bg-slate-900 text-white rounded-xl p-6 mb-8">
                    <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-4">Model Configuration</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div><span className="text-slate-400">Qubits:</span> <span className="font-bold">{data.model_config.qubits}</span></div>
                        <div><span className="text-slate-400">Layers:</span> <span className="font-bold">{data.model_config.layers}</span></div>
                        <div><span className="text-slate-400">Parameters:</span> <span className="font-bold">{data.model_config.total_parameters}</span></div>
                        <div><span className="text-slate-400">Optimizer:</span> <span className="font-bold">{data.model_config.optimizer}</span></div>
                        <div><span className="text-slate-400">Learning Rate:</span> <span className="font-bold">{data.model_config.learning_rate}</span></div>
                        <div><span className="text-slate-400">Batch Size:</span> <span className="font-bold">{data.model_config.batch_size}</span></div>
                        <div><span className="text-slate-400">Steps:</span> <span className="font-bold">{data.model_config.training_steps}</span></div>
                        <div><span className="text-slate-400">Loss:</span> <span className="font-bold">{data.model_config.loss_function}</span></div>
                    </div>
                </div>
            )}

            {/* Dataset balance + split meta */}
            {ds && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Dataset Balance (Test Set)</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Samples</div>
                            <div className="text-2xl font-black text-slate-900">{ds.test_samples}</div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Positive</div>
                            <div className="text-2xl font-black text-slate-900">{ds.test_positive}</div>
                            <div className="text-xs text-slate-500">{testPosRate != null ? `${(testPosRate * 100).toFixed(1)}%` : ''}</div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Negative</div>
                            <div className="text-2xl font-black text-slate-900">{ds.test_negative}</div>
                            <div className="text-xs text-slate-500">{testNegRate != null ? `${(testNegRate * 100).toFixed(1)}%` : ''}</div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Why it matters</div>
                            <div className="text-xs text-slate-600 mt-1">
                                If classes are imbalanced, prefer <strong>Balanced Accuracy</strong>, <strong>MCC</strong>, and <strong>AUC</strong> over raw accuracy.
                            </div>
                        </div>
                    </div>
                    {data.split_meta && (
                        <div className="mt-4 text-xs text-slate-500 font-mono bg-slate-50 border border-slate-200 rounded-lg p-3 overflow-x-auto">
                            Split: {JSON.stringify(data.split_meta)}
                        </div>
                    )}
                </div>
            )}

            {/* Train vs Test (overfitting check) */}
            {tm && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Train vs Test (Overfitting Check)</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <MetricCard label="Test Accuracy" value={m.accuracy} percentage description="Held-out performance" />
                        <MetricCard label="Train Accuracy" value={tm.accuracy} percentage color="slate" description="In-sample performance" />
                        <MetricCard label="Test AUC-ROC" value={m.auc_roc} percentage color="indigo" description="Discrimination" />
                        <MetricCard label="Train AUC-ROC" value={tm.auc_roc} percentage color="slate" description="In-sample discrimination" />
                        <MetricCard label="Test MCC" value={m.mcc} color="violet" description="Best single metric for imbalance" />
                        <MetricCard label="Train MCC" value={tm.mcc} color="slate" description="In-sample MCC" />
                        <MetricCard label="Test F1" value={m.f1_score} percentage color="pink" description="Precision/Recall balance" />
                        <MetricCard label="Train F1" value={tm.f1_score} percentage color="slate" description="In-sample F1" />
                    </div>
                    <div className="text-xs text-slate-500 mt-3">
                        Big train-vs-test gaps suggest overfitting; similar values suggest good generalization (or a noisy/limited dataset).
                    </div>
                </div>
            )}

            {/* Primary Metrics */}
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> Primary Classification Metrics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <MetricCard label="Accuracy" value={m.accuracy} percentage description="Overall correctness" />
                <MetricCard label="Precision" value={m.precision} percentage description="True positives / predicted positives" />
                <MetricCard label="Recall" value={m.recall} percentage description="True positives / actual positives" />
                <MetricCard label="F1 Score" value={m.f1_score} percentage description="Harmonic mean of precision & recall" />
            </div>

            {/* Advanced Metrics */}
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" /> Advanced Metrics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <MetricCard label="AUC-ROC" value={m.auc_roc} percentage description="Area under ROC curve" color="indigo" />
                <MetricCard label="AUC-PR" value={m.auc_pr} percentage description="Area under PR curve" color="pink" />
                <MetricCard label="MCC" value={m.mcc} description="Matthews Correlation Coefficient" color="violet" />
                <MetricCard label="Cohen's Kappa" value={m.cohen_kappa} description="Inter-rater agreement" color="purple" />
                <MetricCard label="Balanced Acc." value={m.balanced_accuracy} percentage description="Mean of sensitivity & specificity" />
                <MetricCard label="Specificity" value={m.specificity} percentage description="True negative rate" />
                <MetricCard label="Log Loss" value={m.log_loss} description="Cross-entropy loss" color="red" />
                <MetricCard label="NPV" value={m.npv} percentage description="Negative predictive value" />
            </div>

            {/* Confusion Matrix */}
            <h2 className="text-xl font-bold text-slate-800 mb-4">Confusion Matrix</h2>
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8 max-w-md">
                <div className="text-center text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Predicted</div>
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div></div>
                    <div className="text-xs font-bold text-slate-500">No Risk</div>
                    <div className="text-xs font-bold text-slate-500">Risk</div>

                    <div className="text-xs font-bold text-slate-500 flex items-center justify-end pr-2">No Risk</div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="text-2xl font-black text-green-700">{cm.tn}</div>
                        <div className="text-xs text-green-600">TN</div>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="text-2xl font-black text-red-700">{cm.fp}</div>
                        <div className="text-xs text-red-600">FP</div>
                    </div>

                    <div className="text-xs font-bold text-slate-500 flex items-center justify-end pr-2">Risk</div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="text-2xl font-black text-red-700">{cm.fn}</div>
                        <div className="text-xs text-red-600">FN</div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="text-2xl font-black text-green-700">{cm.tp}</div>
                        <div className="text-xs text-green-600">TP</div>
                    </div>
                </div>
                <div className="text-xs text-slate-400 text-center mt-3">
                    Total: {cm.tn + cm.fp + cm.fn + cm.tp} samples | Only {cm.fp + cm.fn} misclassified
                </div>
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
                {rocChart && (
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h3 className="font-bold text-slate-800 mb-4">ROC Curve</h3>
                        <div className="h-72"><Line data={rocChart} options={{...chartOptions, scales: {...chartOptions.scales, x: {title: {display: true, text: 'False Positive Rate'}}, y: {title: {display: true, text: 'True Positive Rate'}, min: 0, max: 1}}}} /></div>
                    </div>
                )}
                {prChart && (
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h3 className="font-bold text-slate-800 mb-4">Precision-Recall Curve</h3>
                        <div className="h-72"><Line data={prChart} options={{...chartOptions, scales: {...chartOptions.scales, x: {title: {display: true, text: 'Recall'}}, y: {title: {display: true, text: 'Precision'}, min: 0, max: 1}}}} /></div>
                    </div>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
                {thresholdChart && (
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h3 className="font-bold text-slate-800 mb-4">Threshold Analysis</h3>
                        <div className="h-72"><Line data={thresholdChart} options={{...chartOptions, scales: {...chartOptions.scales, x: {title: {display: true, text: 'Threshold'}}, y: {min: 0, max: 1}}}} /></div>
                    </div>
                )}
                {featureChart && (
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h3 className="font-bold text-slate-800 mb-4">Feature Importance</h3>
                        <div className="h-72"><Bar data={featureChart} options={{...chartOptions, indexAxis: 'y', scales: {x: {title: {display: true, text: 'Accuracy Drop When Permuted'}}, y: {grid: {display: false}}}}} /></div>
                    </div>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
                {tierChart && (
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h3 className="font-bold text-slate-800 mb-4">Risk Tier Distribution</h3>
                        <div className="h-72 flex items-center justify-center"><Doughnut data={tierChart} options={{responsive: true, maintainAspectRatio: false, plugins: {legend: {position: 'bottom'}}}} /></div>
                    </div>
                )}
                {histChart && (
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h3 className="font-bold text-slate-800 mb-4">Probability Distribution</h3>
                        <div className="h-72"><Bar data={histChart} options={{...chartOptions, scales: {...chartOptions.scales, x: {title: {display: true, text: 'Risk Probability'}}, y: {title: {display: true, text: 'Count'}}}}} /></div>
                    </div>
                )}
            </div>

            {trainingChart && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
                    <h3 className="font-bold text-slate-800 mb-4">Training Loss Curve</h3>
                    <div className="h-72"><Line data={trainingChart} options={{...chartOptions, scales: {...chartOptions.scales, x: {title: {display: true, text: 'Training Step'}}, y: {title: {display: true, text: 'MSE Loss'}}}}} /></div>
                </div>
            )}

            {/* Dataset Info */}
            {data.dataset && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
                    <h3 className="font-bold text-slate-800 mb-4">Dataset Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div><span className="text-slate-500">Total Samples:</span> <span className="font-bold">{data.dataset.total_samples}</span></div>
                        <div><span className="text-slate-500">Train Set:</span> <span className="font-bold">{data.dataset.train_samples}</span></div>
                        <div><span className="text-slate-500">Test Set:</span> <span className="font-bold">{data.dataset.test_samples}</span></div>
                        <div><span className="text-slate-500">Split:</span> <span className="font-bold">{data.dataset.split_ratio}</span></div>
                        <div><span className="text-slate-500">Test Positive:</span> <span className="font-bold">{data.dataset.test_positive}</span></div>
                        <div><span className="text-slate-500">Test Negative:</span> <span className="font-bold">{data.dataset.test_negative}</span></div>
                    </div>
                </div>
            )}

            {/* Metric Explanations */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 mb-4">Understanding These Metrics</h3>
                <div className="space-y-4 text-sm text-slate-700">
                    <div><strong>Accuracy</strong> — The fraction of all predictions that are correct. High accuracy means the model rarely makes mistakes.</div>
                    <div><strong>Precision</strong> — Of all samples the model predicted as "Risk", how many actually were at risk. High precision means few false alarms.</div>
                    <div><strong>Recall (Sensitivity)</strong> — Of all actual at-risk students, how many did the model catch. High recall means few missed cases — critical in healthcare.</div>
                    <div><strong>F1 Score</strong> — The harmonic mean of precision and recall. Balances both metrics into a single number. Ranges from 0 to 1.</div>
                    <div><strong>AUC-ROC</strong> — Area Under the Receiver Operating Characteristic curve. Measures the model's ability to distinguish between classes across all thresholds. 1.0 is perfect, 0.5 is random.</div>
                    <div><strong>AUC-PR</strong> — Area Under the Precision-Recall curve. More informative than AUC-ROC when classes are imbalanced.</div>
                    <div><strong>MCC (Matthews Correlation Coefficient)</strong> — A balanced measure that accounts for all four confusion matrix values. Ranges from -1 (worst) to +1 (perfect). Considered the best single metric for binary classification.</div>
                    <div><strong>Cohen's Kappa</strong> — Measures agreement between predicted and actual labels, adjusted for chance agreement. Values above 0.8 indicate almost perfect agreement.</div>
                    <div><strong>Log Loss</strong> — Penalizes confident wrong predictions more heavily. Lower is better. Measures calibration of predicted probabilities.</div>
                    <div><strong>Specificity</strong> — True negative rate. Of all non-risk students, how many were correctly identified as safe.</div>
                    <div><strong>NPV (Negative Predictive Value)</strong> — Of all students predicted as "No Risk", how many truly are safe.</div>
                </div>
            </div>
        </div>
    );
}
