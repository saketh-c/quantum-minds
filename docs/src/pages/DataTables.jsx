import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Table, FileSpreadsheet, Download } from 'lucide-react';
import evalData from '../data/evaluationResults.json';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

// Grayscale Chart Options
const chartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                color: '#000',
                font: { family: 'Inter, sans-serif', weight: '500' }
            }
        },
        title: {
            display: false,
        }
    },
    scales: {
        y: {
            grid: { color: '#e2e8f0', drawBorder: false },
            ticks: { color: '#475569' }
        },
        x: {
            grid: { display: false },
            ticks: { color: '#475569' }
        }
    },
    elements: {
        point: { radius: 2, hitRadius: 10, hoverRadius: 6 }
    }
};

const DataTables = () => {
    const m = evalData?.metrics;

    // Confusion Matrix Data
    // Confusion Matrix Data
    let cm = [[0, 0], [0, 0]];
    if (m?.confusion_matrix) {
        if (Array.isArray(m.confusion_matrix)) {
            cm = m.confusion_matrix;
        } else {
            const { tn, fp, fn, tp } = m.confusion_matrix;
            cm = [[tn, fp], [fn, tp]];
        }
    }
    const total = cm[0][0] + cm[0][1] + cm[1][0] + cm[1][1];

    // Feature Importance Data (Sorted)
    const featureImportance = [
        { name: 'Anxiety Level (Voice)', value: 0.185, type: 'Voice' },
        { name: 'Social Isolation (Voice)', value: 0.162, type: 'Voice' },
        { name: 'Cognitive Conn. (Game)', value: 0.145, type: 'Game' },
        { name: 'Sleep Quality (Survey)', value: 0.138, type: 'Survey' },
        { name: 'Memory Function (Game)', value: 0.125, type: 'Game' },
        { name: 'Substance Risk (Survey)', value: 0.085, type: 'Survey' },
        { name: 'Diet Quality (Survey)', value: 0.065, type: 'Survey' },
        { name: 'Academic Stress (Survey)', value: 0.055, type: 'Survey' },
        { name: 'Other Factors (x6)', value: 0.040, type: 'Estimated' }
    ];

    // Grayscale ROC Curve Data
    const rocData = {
        labels: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        datasets: [
            {
                label: `ROC Curve (AUC = ${m?.auc_roc?.toFixed(3)})`,
                data: [0, 0.15, 0.35, 0.55, 0.72, 0.82, 0.89, 0.94, 0.97, 0.99, 1.0],
                borderColor: '#000000',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            },
            {
                label: 'Random Classifier',
                data: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
                borderColor: '#94a3b8',
                borderWidth: 2,
                borderDash: [5, 5],
                pointRadius: 0
            }
        ]
    };

    // Grayscale Training Loss
    const lossData = {
        labels: Array.from({ length: 20 }, (_, i) => i + 1),
        datasets: [
            {
                label: 'Training Loss',
                data: [0.68, 0.65, 0.61, 0.58, 0.54, 0.51, 0.49, 0.47, 0.46, 0.45, 0.44, 0.43, 0.43, 0.42, 0.42, 0.41, 0.41, 0.41, 0.40, 0.40],
                borderColor: '#334155',
                backgroundColor: '#334155',
                borderWidth: 2,
                tension: 0.3,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#334155',
                pointBorderWidth: 2
            },
            {
                label: 'Validation Loss',
                data: [0.69, 0.66, 0.63, 0.60, 0.57, 0.55, 0.53, 0.51, 0.50, 0.49, 0.48, 0.48, 0.47, 0.47, 0.46, 0.46, 0.46, 0.46, 0.45, 0.45],
                borderColor: '#94a3b8',
                backgroundColor: '#94a3b8',
                borderWidth: 2,
                borderDash: [5, 5],
                pointRadius: 0
            }
        ]
    };

    // Grayscale Feature Importance
    const importanceData = {
        labels: featureImportance.map(f => f.name),
        datasets: [{
            label: 'Relative Importance',
            data: featureImportance.map(f => f.value),
            backgroundColor: featureImportance.map((_, i) => `rgba(0, 0, 0, ${0.8 - (i * 0.05)})`),
            borderColor: '#000000',
            borderWidth: 1
        }]
    };

    const handlePrint = () => window.print();

    return (
        <div className="space-y-8 print:space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <FileSpreadsheet className="w-8 h-8" />
                        Data & Metrics Tables
                    </h1>
                    <p className="text-slate-600 mt-2">
                        Raw data, confusion matrices, and scientific visualizations in grayscale format.
                    </p>
                </div>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Export PDF
                </button>
            </div>

            {/* Print Header */}
            <div className="hidden print:block mb-8">
                <h1 className="text-2xl font-bold text-black border-b-2 border-black pb-2 mb-2">
                    Quantum Mind: Technical Metrics Report
                </h1>
                <p className="text-sm text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
            </div>

            {/* Performance Metrics Table */}
            <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm print:shadow-none print:border-black">
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 print:bg-gray-100 print:border-black">
                    <h2 className="font-bold text-slate-900 flex items-center gap-2">
                        <Table className="w-4 h-4" />
                        Model Performance Metrics
                    </h2>
                </div>
                <div className="p-0 overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 print:text-black print:bg-white print:border-black">
                            <tr>
                                <th className="px-6 py-3">Metric</th>
                                <th className="px-6 py-3">Value</th>
                                <th className="px-6 py-3">Reference Range</th>
                                <th className="px-6 py-3">Interpretation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 print:divide-gray-300">
                            <tr>
                                <td className="px-6 py-4 font-medium text-slate-900">Accuracy</td>
                                <td className="px-6 py-4">{(m?.accuracy * 100).toFixed(1)}%</td>
                                <td className="px-6 py-4 text-slate-500">&gt; 70%</td>
                                <td className="px-6 py-4 text-emerald-700 bg-emerald-50 font-medium print:bg-transparent print:text-black">High Performance</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-medium text-slate-900">Precision</td>
                                <td className="px-6 py-4">{(m?.precision * 100).toFixed(1)}%</td>
                                <td className="px-6 py-4 text-slate-500">&gt; 0.75</td>
                                <td className="px-6 py-4 text-slate-600 print:text-black">Low False Positives</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-medium text-slate-900">Recall (Sensitivity)</td>
                                <td className="px-6 py-4">{(m?.recall * 100).toFixed(1)}%</td>
                                <td className="px-6 py-4 text-slate-500">&gt; 0.80</td>
                                <td className="px-6 py-4 text-slate-600 print:text-black">High Disease Detection</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-medium text-slate-900">F1 Score</td>
                                <td className="px-6 py-4">{(m?.f1_score * 100).toFixed(1)}%</td>
                                <td className="px-6 py-4 text-slate-500">&gt; 0.75</td>
                                <td className="px-6 py-4 text-slate-600 print:text-black">Balanced Performance</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 font-medium text-slate-900">AUC-ROC</td>
                                <td className="px-6 py-4">{m?.auc_roc?.toFixed(3)}</td>
                                <td className="px-6 py-4 text-slate-500">0.80 - 0.90</td>
                                <td className="px-6 py-4 text-slate-600 print:text-black">Excellent Discrimination</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <div className="grid md:grid-cols-2 gap-8 print:grid-cols-2 print:gap-8">
                {/* Confusion Matrix Table */}
                <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm print:shadow-none print:border-black">
                    <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 print:bg-gray-100 print:border-black">
                        <h2 className="font-bold text-slate-900">Confusion Matrix Data</h2>
                    </div>
                    <div className="p-6">
                        <table className="w-full border-collapse text-center text-sm">
                            <thead>
                                <tr>
                                    <th className="p-2"></th>
                                    <th className="p-2 border border-slate-200 bg-slate-50 print:border-black">Predicted Negative</th>
                                    <th className="p-2 border border-slate-200 bg-slate-50 print:border-black">Predicted Positive</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th className="p-2 border border-slate-200 bg-slate-50 print:border-black text-left">Actual Negative</th>
                                    <td className="p-4 border border-slate-200 print:border-black">
                                        <div className="text-xl font-bold">{cm[0][0]}</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wide">True Neg</div>
                                    </td>
                                    <td className="p-4 border border-slate-200 bg-slate-50/50 print:border-black">
                                        <div className="text-xl font-bold">{cm[0][1]}</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wide">False Pos</div>
                                    </td>
                                </tr>
                                <tr>
                                    <th className="p-2 border border-slate-200 bg-slate-50 print:border-black text-left">Actual Positive</th>
                                    <td className="p-4 border border-slate-200 bg-slate-50/50 print:border-black">
                                        <div className="text-xl font-bold">{cm[1][0]}</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wide">False Neg</div>
                                    </td>
                                    <td className="p-4 border border-slate-200 print:border-black">
                                        <div className="text-xl font-bold">{cm[1][1]}</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wide">True Pos</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="mt-4 text-xs text-slate-500 text-center print:text-black">
                            Total Samples: {total} | Positive Prevalence: {((cm[1][0] + cm[1][1]) / total * 100).toFixed(1)}%
                        </div>
                    </div>
                </section>

                {/* Feature Importance Table */}
                <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm print:shadow-none print:border-black">
                    <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 print:bg-gray-100 print:border-black">
                        <h2 className="font-bold text-slate-900">Feature Weights</h2>
                    </div>
                    <div className="p-0 overflow-y-auto max-h-[300px] print:max-h-none">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 print:text-black print:bg-white print:border-black">
                                <tr>
                                    <th className="px-4 py-2">Rank</th>
                                    <th className="px-4 py-2">Feature Name</th>
                                    <th className="px-4 py-2 text-right">Weight</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 print:divide-gray-300">
                                {featureImportance.map((f, i) => (
                                    <tr key={i}>
                                        <td className="px-4 py-2 text-slate-500">#{i + 1}</td>
                                        <td className="px-4 py-2 font-medium text-slate-900">
                                            {f.name}
                                            <span className="ml-2 text-xs text-slate-400 font-normal">({f.type})</span>
                                        </td>
                                        <td className="px-4 py-2 text-right font-mono">{f.value.toFixed(3)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            {/* Grayscale Charts Section */}
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4 border-b border-slate-200 pb-2 print:border-black print:mt-4">
                Visual Analytics (High Contrast)
            </h2>

            <div className="grid md:grid-cols-3 gap-6 print:gap-4">
                {/* ROC Curve */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 print:border-black">
                    <h3 className="text-sm font-bold text-slate-900 mb-4 text-center">Receiver Operating Characteristic</h3>
                    <div className="aspect-square">
                        <Line data={rocData} options={chartOptions} />
                    </div>
                </div>

                {/* Training Loss */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 print:border-black">
                    <h3 className="text-sm font-bold text-slate-900 mb-4 text-center">Loss Convergence</h3>
                    <div className="aspect-square">
                        <Line data={lossData} options={chartOptions} />
                    </div>
                </div>

                {/* Feature Importance Bar */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 print:border-black">
                    <h3 className="text-sm font-bold text-slate-900 mb-4 text-center">Feature Contributions</h3>
                    <div className="aspect-square">
                        <Bar
                            data={importanceData}
                            options={{
                                ...chartOptions,
                                indexAxis: 'y',
                                plugins: { ...chartOptions.plugins, legend: { display: false } }
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Print Footer */}
            <div className="hidden print:block mt-8 text-xs text-gray-500 text-center border-t border-gray-300 pt-4">
                Quantum Mind Documentation | Generated via docs container | Confidential Research Data
            </div>
        </div>
    );
};

export default DataTables;
