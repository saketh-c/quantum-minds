/**
 * Client-side port of the backend's /predict endpoint.
 *
 * Produces the same response shape the Flask API returned, so consumers of the
 * prediction result need no changes. The quantum circuit itself lives in
 * quantum.js and is verified against the PennyLane implementation.
 *
 * Two fields cannot be reproduced in the browser:
 *   - clinical_notes: needed a server-side Together API key, so always [].
 *   - confidence_band: uses random weight perturbation, so it varies per call
 *     exactly as it did on the server.
 */
import { forward, gradient, N_QUBITS } from './quantum';
import { WEIGHTS } from './quantumWeights';

export const FEATURE_METADATA = [
  { index: 0, name: 'Cognitive Connectivity', category: 'Neurocognitive', description: 'Focus and attention capacity measured through cognitive tasks', source: 'game' },
  { index: 1, name: 'Memory Function', category: 'Neurocognitive', description: 'Hippocampal-dependent memory performance', source: 'game' },
  { index: 2, name: 'Sleep Quality', category: 'Lifestyle', description: 'Sleep duration and quality patterns', source: 'survey' },
  { index: 3, name: 'Developmental Stage', category: 'Demographic', description: 'Age-normalized pubertal/developmental stage', source: 'proctor' },
  { index: 4, name: 'Anxiety Level', category: 'Emotional', description: 'Anxiety symptoms detected through voice prosody analysis', source: 'biometric' },
  { index: 5, name: 'Social Isolation', category: 'Emotional', description: 'Social withdrawal indicators from voice analysis', source: 'biometric' },
  { index: 6, name: 'Substance Risk', category: 'Behavioral', description: 'Risk factors for substance use', source: 'survey' },
  { index: 7, name: 'Diet Quality', category: 'Lifestyle', description: 'Nutritional habits and dietary patterns', source: 'survey' },
  { index: 8, name: 'Academic Pressure', category: 'Environmental', description: 'Perceived academic stress and workload', source: 'survey' },
  { index: 9, name: 'Family History', category: 'Genetic', description: 'Family history of mental health conditions', source: 'estimated' },
  { index: 10, name: 'Bullying Exposure', category: 'Environmental', description: 'Exposure to bullying or peer victimization', source: 'estimated' },
  { index: 11, name: 'Safety Perception', category: 'Environmental', description: 'Perceived safety in environment', source: 'estimated' },
  { index: 12, name: 'Social Monitoring', category: 'Environmental', description: 'Level of social support and monitoring', source: 'estimated' },
  { index: 13, name: 'Physical Activity', category: 'Lifestyle', description: 'Exercise and physical activity levels', source: 'estimated' },
];

/**
 * Python's round(): half-to-even, unlike JS Math.round()'s half-up.
 * Matters for the 1-5 ratings, where inputs like 0.375 land exactly on x.5
 * and would otherwise round differently than the backend did.
 */
function pyRound(value, digits = 0) {
  const factor = 10 ** digits;
  const scaled = value * factor;
  const floor = Math.floor(scaled);
  const diff = scaled - floor;
  let rounded;
  if (Math.abs(diff - 0.5) < Number.EPSILON * Math.max(1, Math.abs(scaled))) {
    rounded = floor % 2 === 0 ? floor : floor + 1;
  } else {
    rounded = Math.round(scaled);
  }
  return rounded / factor;
}

function convertToRating(value) {
  return Math.max(1, Math.min(5, pyRound(value * 4 + 1)));
}

function getSeverityLevel(riskProb, depressionProb) {
  const combined = riskProb * 0.6 + depressionProb * 0.4;
  if (combined >= 0.8) return { level: 'Critical', color: 'red', recommendation: 'Immediate professional intervention recommended. Contact school counselor or crisis line.' };
  if (combined >= 0.65) return { level: 'Severe', color: 'orange', recommendation: 'Professional evaluation strongly recommended within 1-2 weeks.' };
  if (combined >= 0.45) return { level: 'Moderate', color: 'yellow', recommendation: 'Monitor closely. Consider scheduling a check-in with school counselor.' };
  if (combined >= 0.25) return { level: 'Mild', color: 'green', recommendation: 'Continue monitoring. Encourage healthy habits and open communication.' };
  return { level: 'Minimal', color: 'green', recommendation: 'No immediate concerns. Continue regular wellness check-ins.' };
}

/** Box-Muller, matching the server's np.random.normal(0, sigma). */
function gaussian(sigma) {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return sigma * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function predict(features) {
  if (!Array.isArray(features) || features.length !== N_QUBITS) {
    throw new Error(`Expected ${N_QUBITS} features, got ${features?.length}`);
  }
  const x = features.map(Number);

  const expVal = forward(WEIGHTS, x);
  const riskProb = (expVal + 1) / 2;

  // Gradient-based attribution: signed contribution = dZ/dx_i * x_i
  let featureContributions = [];
  try {
    const grads = gradient(WEIGHTS, x);
    const contributions = grads.map((g, i) => g * x[i]);
    const totalAbs = contributions.reduce((s, c) => s + Math.abs(c), 0) || 1.0;
    featureContributions = FEATURE_METADATA.map((meta, i) => {
      const pct = (contributions[i] / totalAbs) * 100;
      return {
        name: meta.name,
        value: x[i],
        rating: Math.max(1, Math.min(5, pyRound(x[i] * 4 + 1))),
        contribution_pct: pyRound(Math.abs(pct), 1),
        direction: pct > 0 ? 'risk' : 'protective',
      };
    }).sort((a, b) => b.contribution_pct - a.contribution_pct);
  } catch {
    featureContributions = [];
  }

  // Confidence band via weight perturbation (5 circuit runs, as on the server)
  let confidenceBand;
  try {
    const probs = [];
    for (let run = 0; run < 5; run++) {
      const perturbed = WEIGHTS.map((layer) =>
        layer.map((wire) => wire.map((w) => w + gaussian(0.01)))
      );
      probs.push((forward(perturbed, x) + 1) / 2);
    }
    const lo = Math.min(...probs);
    const hi = Math.max(...probs);
    confidenceBand = {
      low: pyRound(lo * 100, 1),
      high: pyRound(hi * 100, 1),
      spread: pyRound((hi - lo) * 100, 1),
    };
  } catch {
    confidenceBand = { low: 0, high: 0, spread: 0 };
  }

  const sleepFactor = 1.0 - x[2];
  const substanceFactor = x[6];
  const academicFactor = x[8];
  const familyFactor = x[9];
  const bullyingFactor = x[10];
  const safetyFactor = 1.0 - x[11];
  const socialFactor = 1.0 - x[12];
  const physicalFactor = 1.0 - x[13];

  let depressionProb =
    riskProb * 0.3 +
    x[4] * 0.15 +
    x[5] * 0.1 +
    sleepFactor * 0.1 +
    academicFactor * 0.08 +
    familyFactor * 0.07 +
    bullyingFactor * 0.06 +
    substanceFactor * 0.05 +
    safetyFactor * 0.03 +
    socialFactor * 0.03 +
    physicalFactor * 0.03;
  depressionProb = Math.min(1.0, Math.max(0.0, depressionProb));

  const defaultCount = x.filter((f) => Math.abs(f - 0.5) < 0.05).length;
  const mean = x.reduce((s, v) => s + v, 0) / x.length;
  const featureVariance = x.reduce((s, v) => s + (v - mean) ** 2, 0) / x.length;

  let confidence;
  if (defaultCount >= 8) {
    confidence = { level: 'low', note: `${defaultCount} of 14 features at default values. Results may not be fully personalized.`, default_features: defaultCount, feature_variance: featureVariance };
  } else if (defaultCount >= 5) {
    confidence = { level: 'moderate', note: `${defaultCount} of 14 features at default values.`, default_features: defaultCount, feature_variance: featureVariance };
  } else {
    confidence = { level: 'high', note: 'All major features have measured or observed values.', default_features: defaultCount, feature_variance: featureVariance };
  }

  let tier = 'Low';
  if (riskProb > 0.4) tier = 'Moderate';
  if (riskProb > 0.7) tier = 'High';
  if (riskProb > 0.85) tier = 'Crisis';

  const riskPct = riskProb * 100;
  const tierBoundaries = [
    ['Low', 0, 40, 'Moderate'],
    ['Moderate', 40, 70, 'High'],
    ['High', 70, 85, 'Crisis'],
    ['Crisis', 85, 100, null],
  ];
  let tierContext = {};
  for (let i = 0; i < tierBoundaries.length; i++) {
    const [tName, tMin, tMax, tNext] = tierBoundaries[i];
    if (tName === tier) {
      tierContext = {
        current_tier: tName,
        tier_min: tMin,
        tier_max: tMax,
        points_to_next_tier: tNext ? pyRound(tMax - riskPct, 1) : 0,
        next_tier_name: tNext,
        points_above_prev_tier: pyRound(riskPct - tMin, 1),
        prev_tier_name: i - 1 >= 0 ? tierBoundaries[i - 1][0] : null,
      };
      break;
    }
  }

  const severity = getSeverityLevel(riskProb, depressionProb);

  const featureReport = FEATURE_METADATA.map((meta) => {
    const value = x[meta.index];
    const rating = convertToRating(value);
    let status, statusText;
    if (meta.source === 'estimated') {
      if (Math.abs(value - 0.5) < 0.01) {
        status = 'estimated';
        statusText = 'Estimated (default - not directly assessed)';
      } else {
        status = 'proctor';
        statusText = 'Assessed by clinical proctor';
      }
    } else {
      status = 'measured';
      statusText = `Measured via ${meta.source}`;
    }

    let healthIndicator;
    if (meta.category === 'Emotional' || meta.category === 'Behavioral') {
      healthIndicator = value < 0.3 ? 'good' : value < 0.6 ? 'moderate' : 'concerning';
    } else {
      healthIndicator = value > 0.7 ? 'good' : value > 0.4 ? 'moderate' : 'concerning';
    }

    return {
      index: meta.index,
      name: meta.name,
      category: meta.category,
      description: meta.description,
      value,
      rating,
      status,
      status_text: statusText,
      health_indicator: healthIndicator,
      source: meta.source,
    };
  });

  return {
    risk_probability: riskProb,
    risk_percentage: riskProb * 100,
    risk_tier: tier,
    depression_probability: depressionProb,
    depression_percentage: depressionProb * 100,
    severity,
    confidence,
    quantum_raw: expVal,
    decision_threshold: 0.45,
    confidence_band: confidenceBand,
    feature_contributions: featureContributions,
    tier_context: tierContext,
    clinical_notes: [],
    feature_report: featureReport,
    summary: {
      total_features: 14,
      measured_features: featureReport.filter((f) => f.status === 'measured' || f.status === 'proctor').length,
      estimated_features: featureReport.filter((f) => f.status === 'estimated').length,
      average_rating: featureReport.reduce((s, f) => s + f.rating, 0) / featureReport.length,
      concerning_features: featureReport.filter((f) => f.health_indicator === 'concerning').length,
    },
  };
}
