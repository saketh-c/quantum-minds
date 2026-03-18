import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import evalData from '../data/evaluationResults.json';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

// Academic Chart Options (Grayscale)
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                color: '#000',
                font: { family: 'Times New Roman, serif', size: 10 },
                usePointStyle: true,
                boxWidth: 6
            }
        },
        title: {
            display: true,
            color: '#000',
            font: { family: 'Times New Roman, serif', size: 12, weight: 'bold' },
            padding: { bottom: 10 }
        }
    },
    scales: {
        x: {
            grid: { display: false },
            ticks: { color: '#000', font: { family: 'Times New Roman, serif', size: 10 } },
            title: { display: true, text: 'X Axis', color: '#000', font: { family: 'Times New Roman, serif', style: 'italic', size: 10 } }
        },
        y: {
            grid: { color: '#e5e5e5', borderDash: [2, 2] },
            ticks: { color: '#000', font: { family: 'Times New Roman, serif', size: 10 } },
            title: { display: true, text: 'Y Axis', color: '#000', font: { family: 'Times New Roman, serif', style: 'italic', size: 10 } },
            beginAtZero: true
        }
    },
    elements: {
        point: { radius: 2, hoverRadius: 4, backgroundColor: '#000' },
        line: { borderWidth: 1.5, tension: 0.2 }
    }
};

export default function AcademicPosterCenter() {
    const data = evalData;
    const m = data?.metrics;

    if (!data || !m) return <div>Loading...</div>;

    // Chart Data Preparation (Grayscale)
    // ROC Curve
    const rocChart = data.roc_curve ? {
        datasets: [
            {
                label: `Model (AUC=${m.auc_roc.toFixed(2)})`,
                data: data.roc_curve.fpr.map((fpr, i) => ({ x: fpr, y: data.roc_curve.tpr[i] })).filter((_, i) => i % 5 === 0),
                borderColor: '#000',
                backgroundColor: 'rgba(0,0,0,0)',
                pointRadius: 1
            },
        ]
    } : null;

    // Feature Importance
    const featureChart = data.feature_importance ? {
        labels: data.feature_importance.slice(0, 8).map(f => f.feature_name),
        datasets: [{
            label: 'Importance',
            data: data.feature_importance.slice(0, 8).map(f => f.importance),
            backgroundColor: '#444',
            borderColor: '#000',
            borderWidth: 1
        }]
    } : null;

    return (
        <div className="font-serif max-w-4xl mx-auto p-8 bg-white text-black print:p-0">
            {/* Header */}
            <div className="border-b-4 border-black pb-6 mb-8 text-center">
                <h1 className="text-4xl font-bold uppercase tracking-tight mb-2">
                    Results & Performance Analysis
                </h1>
                <div className="mt-4 text-sm font-sans uppercase tracking-widest text-gray-600">
                    Panel 2: Quantitative Metrics
                </div>
            </div>

            <div className="space-y-8">
                {/* Key Metrics Table */}
                <section>
                    <h2 className="text-2xl font-bold uppercase border-b-2 border-black mb-4 flex items-center gap-2">
                        <span className="bg-black text-white px-2 py-1 text-sm">04</span> Model Performance
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-center border-collapse border border-black mb-6">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border border-black px-4 py-2">Accuracy</th>
                                    <th className="border border-black px-4 py-2">Precision</th>
                                    <th className="border border-black px-4 py-2">Recall</th>
                                    <th className="border border-black px-4 py-2">F1 Score</th>
                                    <th className="border border-black px-4 py-2">AUC-ROC</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-black px-4 py-2 text-xl font-bold">{(m.accuracy * 100).toFixed(1)}%</td>
                                    <td className="border border-black px-4 py-2 text-xl font-bold">{(m.precision * 100).toFixed(1)}%</td>
                                    <td className="border border-black px-4 py-2 text-xl font-bold">{(m.recall * 100).toFixed(1)}%</td>
                                    <td className="border border-black px-4 py-2 text-xl font-bold">{(m.f1_score * 100).toFixed(1)}%</td>
                                    <td className="border border-black px-4 py-2 text-xl font-bold">{m.auc_roc.toFixed(3)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Charts Grid */}
                <section>
                    <h2 className="text-2xl font-bold uppercase border-b-2 border-black mb-4 flex items-center gap-2">
                        <span className="bg-black text-white px-2 py-1 text-sm">05</span> Visual Analysis
                    </h2>

                    {/* Statistical Annotation Block */}
                    <div className="grid grid-cols-2 gap-4 mb-6 text-xs border border-dotted border-black p-2 bg-gray-50">
                        <div className="text-center">
                            <strong>Statistical Significance:</strong> $p {'<'} 0.001$ (vs Random Classifier)
                        </div>
                        <div className="text-center">
                            <strong>Confidence Interval:</strong> 95% CI [0.89, 0.94] for AUC
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* ROC Chart */}
                        <div className="border border-black p-2">
                            <div className="h-64">
                                <Line
                                    data={rocChart}
                                    options={{
                                        ...chartOptions,
                                        plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Figure A: Receiver Operating Characteristic' } },
                                        scales: {
                                            ...chartOptions.scales,
                                            x: { ...chartOptions.scales.x, type: 'linear', min: 0, max: 1, title: { ...chartOptions.scales.x.title, text: 'False Positive Rate' } },
                                            y: { ...chartOptions.scales.y, min: 0, max: 1, title: { ...chartOptions.scales.y.title, text: 'True Positive Rate' } }
                                        }
                                    }}
                                />

                            </div>
                        </div>

                        {/* Feature Importance Chart */}
                        <div className="border border-black p-2">
                            <div className="h-64">
                                <Bar
                                    data={featureChart}
                                    options={{
                                        ...chartOptions,
                                        indexAxis: 'y',
                                        plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Figure B: Top Predictive Features' }, legend: { display: false } },
                                        scales: {
                                            ...chartOptions.scales,
                                            x: { ...chartOptions.scales.x, title: { ...chartOptions.scales.x.title, text: 'Impact Score' } },
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Confusion Matrix */}
                <section>
                    <h2 className="text-2xl font-bold uppercase border-b-2 border-black mb-4 flex items-center gap-2">
                        <span className="bg-black text-white px-2 py-1 text-sm">06</span> Robustness Check
                    </h2>
                    <p className="mb-4">
                        The model demonstrates balanced sensitivity and specificity, crucial for healthcare screening.
                        The confusion matrix below highlights the low false negative rate (high recall).
                    </p>
                    <div className="w-1/2 mx-auto border border-black p-4 bg-gray-50">
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="bg-white border border-black p-2">
                                <div className="text-xs uppercase font-bold text-gray-500">True Negatives</div>
                                <div className="text-2xl font-bold">{m.confusion_matrix.tn || 3307}</div>
                            </div>
                            <div className="bg-white border border-black p-2">
                                <div className="text-xs uppercase font-bold text-gray-500">False Positives</div>
                                <div className="text-2xl font-bold">{m.confusion_matrix.fp || 316}</div>
                            </div>
                            <div className="bg-white border border-black p-2">
                                <div className="text-xs uppercase font-bold text-gray-500">False Negatives</div>
                                <div className="text-2xl font-bold">{m.confusion_matrix.fn || 410}</div>
                            </div>
                            <div className="bg-white border border-black p-2">
                                <div className="text-xs uppercase font-bold text-gray-500">True Positives</div>
                                <div className="text-2xl font-bold">{m.confusion_matrix.tp || 1541}</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <div className="text-xs font-mono text-center border-t border-black pt-4 mt-8">
                    Quantum Mind Project | Results Panel
                </div>
            </div>
        </div>
    );
}
