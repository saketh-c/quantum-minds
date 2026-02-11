import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Zap, Target, Settings, TrendingDown } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

import evalData from '../data/evaluationResults.json';

export default function Training() {
    const trainingHistory = evalData?.training_history;

    const trainingChart = trainingHistory ? {
        labels: trainingHistory.steps,
        datasets: [{
            label: 'Training Loss (MSE)',
            data: trainingHistory.losses,
            borderColor: '#e64980',
            backgroundColor: 'rgba(230, 73, 128, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 1
        }]
    } : null;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 mb-2">Training Process</h1>
                <p className="text-slate-600">How the VQC learns: optimizer, loss function, hyperparameters, and convergence behavior.</p>
            </div>

            {/* Overview */}
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-rose-900 mb-3">Training at a Glance</h2>
                <p className="text-rose-800 text-sm mb-4">
                    The VQC is trained using a <strong>hybrid quantum-classical optimization loop</strong>. The quantum circuit runs the forward pass (encoding data and computing predictions), while a classical optimizer (Adam) computes gradients and updates the 84 trainable parameters.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Optimizer', value: 'Adam' },
                        { label: 'Learning Rate', value: '0.05' },
                        { label: 'Batch Size', value: '32' },
                        { label: 'Training Steps', value: '100' },
                        { label: 'Loss Function', value: 'MSE' },
                        { label: 'Parameters', value: '84' },
                        { label: 'Train/Test Split', value: '80/20' },
                        { label: 'Final Accuracy', value: '99.93%' },
                    ].map((item, i) => (
                        <div key={i} className="bg-white/80 rounded-lg p-3 border border-rose-100">
                            <div className="text-xs text-rose-600 font-semibold">{item.label}</div>
                            <div className="text-lg font-black text-rose-900">{item.value}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Training Loop */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" /> The Training Loop
                </h2>
                <div className="text-sm text-slate-700 space-y-4">
                    <p>Each training step follows this sequence:</p>
                    <div className="space-y-4">
                        {[
                            { step: '1. Sample Batch', desc: 'Randomly select 32 samples from the training set (22,297 total). Random sampling introduces stochasticity that helps escape local minima.', code: 'indices = np.random.randint(0, len(X_train), 32)' },
                            { step: '2. Forward Pass (Quantum)', desc: 'Each sample in the batch is encoded into the 14-qubit circuit. The circuit produces a prediction for each sample (-1 to +1).', code: 'preds = [circuit(weights, x) for x in X_batch]' },
                            { step: '3. Compute Loss', desc: 'Mean Squared Error between predictions and true labels ({-1, +1}). MSE penalizes large errors quadratically.', code: 'loss = mean((preds - Y_batch)²)' },
                            { step: '4. Compute Gradients', desc: 'PennyLane uses the parameter-shift rule to compute quantum gradients. Each parameter is shifted by ±π/2 and the circuit re-evaluated to estimate the gradient.', code: '∂L/∂w = [f(w + π/2) - f(w - π/2)] / 2' },
                            { step: '5. Update Weights (Classical)', desc: 'Adam optimizer updates all 84 parameters using adaptive learning rates. Adam maintains per-parameter momentum and variance estimates.', code: 'weights = adam_update(weights, gradients, lr=0.05)' },
                        ].map((item, i) => (
                            <div key={i} className="border-l-4 border-amber-300 pl-4">
                                <div className="font-bold text-slate-900">{item.step}</div>
                                <p className="text-slate-600 text-xs mb-2">{item.desc}</p>
                                <div className="bg-slate-50 rounded px-3 py-1.5 font-mono text-xs text-slate-700">{item.code}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Training Loss Curve */}
            {trainingChart && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <TrendingDown className="w-5 h-5 text-rose-500" /> Training Loss Curve
                    </h2>
                    <div className="h-80">
                        <Line data={trainingChart} options={{
                            responsive: true, maintainAspectRatio: false,
                            plugins: { legend: { position: 'top' } },
                            scales: {
                                x: { title: { display: true, text: 'Training Step' }, grid: { display: false } },
                                y: { title: { display: true, text: 'MSE Loss' }, grid: { color: '#f1f5f9' } }
                            }
                        }} />
                    </div>
                    <p className="text-xs text-slate-500 mt-3">The loss decreases over training steps as the model learns to separate risk from non-risk patients. Fluctuations are normal due to mini-batch sampling.</p>
                </div>
            )}

            {!trainingChart && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8 text-center">
                    <TrendingDown className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="font-bold text-slate-700 mb-1">Training Loss Curve Not Available</h3>
                    <p className="text-sm text-slate-500 mb-3">Re-run training to generate the loss history:</p>
                    <code className="bg-white px-4 py-2 rounded-lg text-sm font-mono border border-slate-200">python backend/train_vqc.py</code>
                </div>
            )}

            {/* Adam Optimizer */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-slate-600" /> Why Adam Optimizer?
                </h2>
                <div className="text-sm text-slate-700 space-y-3">
                    <p>
                        Adam (Adaptive Moment Estimation) is the gold standard optimizer for VQCs because it addresses several challenges specific to quantum circuits:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <h4 className="font-bold text-slate-800 mb-2">Barren Plateaus</h4>
                            <p className="text-xs text-slate-600">VQCs suffer from barren plateaus — regions where gradients vanish exponentially. Adam's momentum helps the optimizer "push through" these flat regions by accumulating gradient history.</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <h4 className="font-bold text-slate-800 mb-2">Adaptive Learning Rate</h4>
                            <p className="text-xs text-slate-600">Adam adjusts the learning rate for each parameter individually. Parameters with small gradients get larger updates; parameters with large gradients get smaller updates. Critical for the 84 parameters in our VQC.</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <h4 className="font-bold text-slate-800 mb-2">Noisy Gradients</h4>
                            <p className="text-xs text-slate-600">Quantum gradient estimation via parameter-shift is inherently noisy. Adam's exponential moving averages smooth out this noise, providing more stable updates.</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <h4 className="font-bold text-slate-800 mb-2">Fast Convergence</h4>
                            <p className="text-xs text-slate-600">With only 100 training steps and 84 parameters, we need rapid convergence. Adam typically converges faster than vanilla SGD or even RMSProp for small parameter counts.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loss Function */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-red-500" /> Loss Function: Mean Squared Error
                </h2>
                <div className="text-sm text-slate-700 space-y-3">
                    <div className="bg-slate-900 text-green-400 font-mono rounded-lg p-4 text-sm">
                        <div>def cost(weights, x_batch, y_batch):</div>
                        <div className="ml-4">preds = [circuit(weights, x) for x in x_batch]</div>
                        <div className="ml-4">return mean((preds - y_batch)²)</div>
                        <div className="text-slate-500 mt-2"># y_batch values are -1 (no risk) or +1 (risk)</div>
                        <div className="text-slate-500"># preds are continuous values from -1 to +1</div>
                    </div>
                    <p>
                        <strong>Why MSE instead of Cross-Entropy?</strong> The quantum circuit outputs a continuous expectation value [-1, +1], not a probability. MSE naturally handles this continuous output space. The labels are mapped to {'{-1, +1}'} to match the PauliZ measurement range.
                    </p>
                    <p>
                        <strong>Label mapping:</strong> Original labels (0, 1) are transformed to (-1, +1) via: <code className="bg-slate-100 px-1 rounded">Y = labels × 2 - 1</code>. This aligns with the PauliZ operator's eigenvalues.
                    </p>
                </div>
            </div>

            {/* Gradient Computation */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-900 text-white rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">Parameter-Shift Rule: Quantum Gradients</h2>
                <div className="text-sm text-slate-300 space-y-3">
                    <p>
                        Classical neural networks compute gradients via backpropagation. But quantum circuits don't support backpropagation directly. Instead, PennyLane uses the <strong>parameter-shift rule</strong>.
                    </p>
                    <div className="bg-white/10 backdrop-blur rounded-lg p-4 font-mono text-xs">
                        <div className="text-green-300">For each parameter w:</div>
                        <div className="text-green-300 ml-4">∂Loss/∂w = [Loss(w + π/2) - Loss(w - π/2)] / 2</div>
                        <div className="text-slate-400 mt-2">// Requires 2 circuit evaluations per parameter</div>
                        <div className="text-slate-400">// Total per step: 84 params × 2 evals × 32 batch = 5,376 circuit runs</div>
                    </div>
                    <p>
                        This means each training step involves running the quantum circuit <strong>thousands of times</strong>. This is why quantum ML training is computationally expensive — and why we use only 100 steps with batch size 32.
                    </p>
                    <p>
                        The parameter-shift rule is <strong>exact</strong> (not an approximation) for gates with two eigenvalues, which includes all rotation gates (RX, RY, RZ) used in our circuit. This gives us analytically correct gradients despite the quantum nature of the computation.
                    </p>
                </div>
            </div>
        </div>
    );
}
