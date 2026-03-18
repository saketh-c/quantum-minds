import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { BookOpen, AlertCircle, Check, Download } from 'lucide-react';

import evalData from '../data/evaluationResults.json';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

// Academic/Grayscale Chart Options
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                color: '#000',
                font: { family: 'Times New Roman, serif', size: 12 },
                usePointStyle: true,
                boxWidth: 6
            }
        },
        title: {
            display: true,
            color: '#000',
            font: { family: 'Times New Roman, serif', size: 14, weight: 'bold' },
            padding: { bottom: 15 }
        },
        tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#000',
            bodyColor: '#333',
            borderColor: '#000',
            borderWidth: 1,
            titleFont: { family: 'Times New Roman, serif' },
            bodyFont: { family: 'Times New Roman, serif' }
        }
    },
    scales: {
        x: {
            grid: { display: false },
            ticks: { color: '#000', font: { family: 'Times New Roman, serif' } },
            title: { display: true, text: 'X Axis', color: '#000', font: { family: 'Times New Roman, serif', style: 'italic' } }
        },
        y: {
            grid: { color: '#e5e5e5', borderDash: [2, 2] },
            ticks: { color: '#000', font: { family: 'Times New Roman, serif' } },
            title: { display: true, text: 'Y Axis', color: '#000', font: { family: 'Times New Roman, serif', style: 'italic' } },
            beginAtZero: true
        }
    },
    interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
    },
    elements: {
        point: { radius: 2, hoverRadius: 5, backgroundColor: '#000' },
        line: { borderWidth: 1.5, tension: 0.2 }
    }
};

export default function AcademicEvaluation() {
    const data = evalData;
    const m = data?.metrics;
    const tm = data?.train_metrics;
    const ds = data?.dataset;

    if (!data || !m) {
        return (
            <div className="text-center py-20 font-serif">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-black mb-2">Data Unavailable</h2>
                <p className="text-gray-600">Evaluation metrics could not be loaded.</p>
            </div>
        );
    }

    // Chart Data Preparation (Grayscale)
    // ----------------------------------

    // ROC Curve
    const rocChart = data.roc_curve ? {
        labels: data.roc_curve.fpr.filter((_, i) => i % 20 === 0).map(v => v.toFixed(2)),
        datasets: [
            {
                label: `Model (AUC = ${m.auc_roc.toFixed(3)})`,
                data: data.roc_curve.tpr.filter((_, i) => i % 20 === 0),
                borderColor: '#000',
                backgroundColor: 'rgba(0, 0, 0, 0)',
                borderDash: [],
                pointRadius: 2,
                pointStyle: 'circle'
            },
            {
                label: 'Random Chance',
                data: data.roc_curve.fpr.filter((_, i) => i % 20 === 0),
                borderColor: '#666',
                borderDash: [5, 5],
                pointRadius: 0,
                borderWidth: 1
            }
        ]
    } : null;

    // PR Curve
    const prChart = data.pr_curve ? {
        labels: data.pr_curve.recall.filter((_, i) => i % 20 === 0).map(v => v.toFixed(2)),
        datasets: [{
            label: `Model (AUC = ${m.auc_pr.toFixed(3)})`,
            data: data.pr_curve.precision.filter((_, i) => i % 20 === 0),
            borderColor: '#000',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            fill: true,
            borderWidth: 1.5
        }]
    } : null;

    // Threshold Analysis
    const thresholdChart = data.threshold_analysis ? {
        labels: data.threshold_analysis.filter((_, i) => i % 5 === 0).map(t => t.threshold.toFixed(1)),
        datasets: [
            { label: 'Accuracy', data: data.threshold_analysis.filter((_, i) => i % 5 === 0).map(t => t.accuracy), borderColor: '#000', borderDash: [], pointStyle: 'circle' },
            { label: 'F1 Score', data: data.threshold_analysis.filter((_, i) => i % 5 === 0).map(t => t.f1), borderColor: '#444', borderDash: [5, 5], pointStyle: 'triangle' },
            { label: 'Precision', data: data.threshold_analysis.filter((_, i) => i % 5 === 0).map(t => t.precision), borderColor: '#888', borderDash: [2, 2], pointStyle: 'rect' },
        ]
    } : null;

    // Feature Importance
    const featureChart = data.feature_importance ? {
        labels: data.feature_importance.slice(0, 10).map(f => f.feature_name),
        datasets: [{
            label: 'Importance Score',
            data: data.feature_importance.slice(0, 10).map(f => f.importance),
            backgroundColor: '#444',
            borderColor: '#000',
            borderWidth: 1
        }]
    } : null;

    // Training History
    const trainingChart = data.training_history ? {
        labels: data.training_history.steps.filter((_, i) => i % 5 === 0),
        datasets: [{
            label: 'MSE Loss',
            data: data.training_history.losses.filter((_, i) => i % 5 === 0),
            borderColor: '#000',
            backgroundColor: 'rgba(0,0,0,0)',
            tension: 0.1,
            pointRadius: 1
        }]
    } : null;

    const handlePrint = () => window.print();

    return (
        <div className="font-serif max-w-5xl mx-auto space-y-12 pb-20 print:space-y-8 print:pb-0">
            {/* Header */}
            <div className="border-b-2 border-black pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-black uppercase tracking-wide">
                        Model Evaluation Report
                    </h1>
                    <p className="text-gray-700 italic mt-1">
                        14-Qubit Variational Quantum Classifier (VQC) Performance Analysis
                    </p>
                    <div className="text-sm mt-3 flex items-center gap-4 text-gray-600 print:text-black">
                        <span><strong>Date:</strong> {new Date().toLocaleDateString()}</span>
                        <span><strong>Model Version:</strong> 1.0.4</span>
                        <span><strong>Status:</strong> Validated</span>
                    </div>
                </div>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-sans uppercase tracking-wider hover:bg-gray-800 transition-colors print:hidden"
                >
                    <Download className="w-4 h-4" /> Export PDF
                </button>
            </div>

            {/* 1. Executive Summary Table */}
            <section>
                <h2 className="text-lg font-bold text-black uppercase border-b border-gray-400 mb-4 pb-1">
                    1. Executive Summary
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse border border-black">
                        <thead className="bg-gray-100 text-black border-b border-black">
                            <tr>
                                <th className="border-r border-black px-4 py-2 w-1/4">Metric Category</th>
                                <th className="border-r border-black px-4 py-2">Test Set Performance</th>
                                <th className="border-r border-black px-4 py-2">Training Set (Ref)</th>
                                <th className="px-4 py-2">Generalization Gap</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-300">
                            <tr>
                                <td className="border-r border-black px-4 py-2 font-bold">Accuracy</td>
                                <td className="border-r border-black px-4 py-2">{(m.accuracy * 100).toFixed(2)}%</td>
                                <td className="border-r border-black px-4 py-2">{(tm?.accuracy * 100).toFixed(2)}%</td>
                                <td className="px-4 py-2">{((tm?.accuracy - m.accuracy) * 100).toFixed(2)}% ({(tm?.accuracy - m.accuracy) < 0.05 ? 'Good' : 'Overfitting'})</td>
                            </tr>
                            <tr>
                                <td className="border-r border-black px-4 py-2 font-bold">AUC-ROC</td>
                                <td className="border-r border-black px-4 py-2">{m.auc_roc.toFixed(4)}</td>
                                <td className="border-r border-black px-4 py-2">{tm?.auc_roc.toFixed(4)}</td>
                                <td className="px-4 py-2">{(tm?.auc_roc - m.auc_roc).toFixed(4)}</td>
                            </tr>
                            <tr>
                                <td className="border-r border-black px-4 py-2 font-bold">F1 Score</td>
                                <td className="border-r border-black px-4 py-2">{(m.f1_score * 100).toFixed(2)}%</td>
                                <td className="border-r border-black px-4 py-2">{(tm?.f1_score * 100).toFixed(2)}%</td>
                                <td className="px-4 py-2">{((tm?.f1_score - m.f1_score) * 100).toFixed(2)}%</td>
                            </tr>
                            <tr>
                                <td className="border-r border-black px-4 py-2 font-bold">MCC</td>
                                <td className="border-r border-black px-4 py-2">{m.mcc.toFixed(4)}</td>
                                <td className="border-r border-black px-4 py-2">{tm?.mcc.toFixed(4)}</td>
                                <td className="px-4 py-2">{(tm?.mcc - m.mcc).toFixed(4)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* 2. Visual Analysis (Charts) */}
            <section className="break-inside-avoid">
                <h2 className="text-lg font-bold text-black uppercase border-b border-gray-400 mb-6 pb-1">
                    2. Visual Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* ROC Chart */}
                    <div className="border border-black p-4 bg-white">
                        <div className="h-64">
                            <Line
                                data={rocChart}
                                options={{
                                    ...chartOptions,
                                    plugins: {
                                        ...chartOptions.plugins,
                                        title: { ...chartOptions.plugins.title, text: 'Figure 1: ROC Analysis' }
                                    },
                                    scales: {
                                        ...chartOptions.scales,
                                        x: { ...chartOptions.scales.x, title: { ...chartOptions.scales.x.title, text: 'False Positive Rate' } },
                                        y: { ...chartOptions.scales.y, title: { ...chartOptions.scales.y.title, text: 'True Positive Rate' } }
                                    }
                                }}
                            />
                        </div>
                        <p className="text-xs text-center mt-2 italic">A steep curve indicates strong separation power.</p>
                    </div>

                    {/* PR Chart */}
                    <div className="border border-black p-4 bg-white">
                        <div className="h-64">
                            <Line
                                data={prChart}
                                options={{
                                    ...chartOptions,
                                    plugins: {
                                        ...chartOptions.plugins,
                                        title: { ...chartOptions.plugins.title, text: 'Figure 2: Precision-Recall Curve' }
                                    },
                                    scales: {
                                        ...chartOptions.scales,
                                        x: { ...chartOptions.scales.x, title: { ...chartOptions.scales.x.title, text: 'Recall' } },
                                        y: { ...chartOptions.scales.y, title: { ...chartOptions.scales.y.title, text: 'Precision' } }
                                    }
                                }}
                            />
                        </div>
                        <p className="text-xs text-center mt-2 italic">Essential for imbalanced datasets.</p>
                    </div>

                    {/* Training Loss */}
                    <div className="border border-black p-4 bg-white">
                        <div className="h-64">
                            <Line
                                data={trainingChart}
                                options={{
                                    ...chartOptions,
                                    plugins: {
                                        ...chartOptions.plugins,
                                        title: { ...chartOptions.plugins.title, text: 'Figure 3: Training Convergence' }
                                    },
                                    scales: {
                                        ...chartOptions.scales,
                                        x: { ...chartOptions.scales.x, title: { ...chartOptions.scales.x.title, text: 'Training Iteration' } },
                                        y: { ...chartOptions.scales.y, title: { ...chartOptions.scales.y.title, text: 'Mean Squared Error' } }
                                    }
                                }}
                            />
                        </div>
                        <p className="text-xs text-center mt-2 italic">Smooth descent indicates stable learning.</p>
                    </div>

                    {/* Feature Importance */}
                    <div className="border border-black p-4 bg-white">
                        <div className="h-64">
                            <Bar
                                data={featureChart}
                                options={{
                                    ...chartOptions,
                                    indexAxis: 'y',
                                    plugins: {
                                        ...chartOptions.plugins,
                                        title: { ...chartOptions.plugins.title, text: 'Figure 4: Top Predictive Features' },
                                        legend: { display: false }
                                    },
                                    scales: {
                                        ...chartOptions.scales,
                                        x: { ...chartOptions.scales.x, title: { ...chartOptions.scales.x.title, text: 'Importance Weight' } },
                                        y: { grid: { display: false } }
                                    }
                                }}
                            />
                        </div>
                        <p className="text-xs text-center mt-2 italic">Features contributing most to classification decisions.</p>
                    </div>
                </div>
            </section>

            {/* 3. Detailed Statistics */}
            <section className="break-before-page">
                <h2 className="text-lg font-bold text-black uppercase border-b border-gray-400 mb-4 pb-1">
                    3. Technical Specifications & Dataset
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="font-bold text-sm uppercase mb-2 border-b border-dotted border-gray-400 pb-1">Model Architecture</h3>
                        <table className="w-full text-sm border-collapse">
                            <tbody>
                                <tr className="border-b border-gray-200"><td className="py-2">Type</td><td class="text-right font-mono">Variational Quantum Classifier</td></tr>
                                <tr className="border-b border-gray-200"><td className="py-2">Qubits</td><td class="text-right font-mono">{data.model_config.qubits}</td></tr>
                                <tr className="border-b border-gray-200"><td className="py-2">Ansatz Layers</td><td class="text-right font-mono">{data.model_config.layers}</td></tr>
                                <tr className="border-b border-gray-200"><td className="py-2">Learnable Params</td><td class="text-right font-mono">{data.model_config.total_parameters}</td></tr>
                                <tr className="border-b border-gray-200"><td className="py-2">Embedding</td><td class="text-right font-mono">Angle (Y-Rotation)</td></tr>
                                <tr className="border-b border-gray-200"><td className="py-2">Entanglement</td><td class="text-right font-mono">Strongly Entangling (CNOT)</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div>
                        <h3 className="font-bold text-sm uppercase mb-2 border-b border-dotted border-gray-400 pb-1">Dataset Composition</h3>
                        <table className="w-full text-sm border-collapse">
                            <tbody>
                                <tr className="border-b border-gray-200"><td className="py-2">Total Samples</td><td class="text-right font-mono">{ds.total_samples}</td></tr>
                                <tr className="border-b border-gray-200"><td className="py-2">Training Set</td><td class="text-right font-mono">{ds.train_samples} ({((ds.train_samples / ds.total_samples) * 100).toFixed(0)}%)</td></tr>
                                <tr className="border-b border-gray-200"><td className="py-2">Test Set</td><td class="text-right font-mono">{ds.test_samples} ({((ds.test_samples / ds.total_samples) * 100).toFixed(0)}%)</td></tr>
                                <tr className="border-b border-gray-200"><td className="py-2">Positive Cases (Test)</td><td class="text-right font-mono">{ds.test_positive} ({((ds.test_positive / ds.test_samples) * 100).toFixed(1)}%)</td></tr>
                                <tr className="border-b border-gray-200"><td className="py-2">Negative Cases (Test)</td><td class="text-right font-mono">{ds.test_negative} ({((ds.test_negative / ds.test_samples) * 100).toFixed(1)}%)</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <div className="border-t border-black pt-4 text-xs text-center font-mono mt-12">
                CONFIDENTIAL - Generated by Quantum Mind Analytics System
            </div>
        </div>
    );
}
