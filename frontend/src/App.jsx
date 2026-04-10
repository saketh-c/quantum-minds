import { useState } from 'react';
import { Brain, Activity, Mic, ShieldCheck, HeartPulse, AlertTriangle, CheckCircle, Info, Minus, ClipboardList, Stethoscope, LogOut, Check } from 'lucide-react';
import NeuralStrike from './components/games/NeuralStrike';
import ReactorSabotage from './components/games/ReactorSabotage';
import HumeVoice from './components/HumeVoice';
import SurveyForm from './components/SurveyForm';
import ProctorForm from './components/ProctorForm';
import axios from 'axios';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://quantum-backend-738298079218.us-central1.run.app';

const STEPS = [
    { id: 'focus', label: 'Focus', icon: Activity },
    { id: 'memory', label: 'Memory', icon: Brain },
    { id: 'survey', label: 'Survey', icon: Mic },
    { id: 'proctor', label: 'Clinical', icon: Stethoscope },
    { id: 'result', label: 'Results', icon: CheckCircle },
];

function StepIndicator({ currentStep }) {
    const stepOrder = ['intro', 'focus', 'memory', 'survey', 'proctor', 'calculating', 'result'];
    const currentIdx = stepOrder.indexOf(currentStep);

    return (
        <div className="flex items-center gap-1 overflow-x-auto">
            {STEPS.map((step, i) => {
                const stepIdx = stepOrder.indexOf(step.id);
                const isComplete = currentIdx > stepIdx;
                const isActive = currentStep === step.id || (step.id === 'result' && currentStep === 'calculating');
                const Icon = step.icon;

                return (
                    <div key={step.id} className="flex items-center">
                        {i > 0 && <div className={`w-6 h-px mx-1 ${isComplete ? 'bg-primary' : 'bg-border'}`} />}
                        <div className="flex items-center gap-1.5">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors
                                ${isComplete ? 'bg-primary text-primary-foreground' :
                                  isActive ? 'bg-primary/10 text-primary border-2 border-primary' :
                                  'bg-muted text-muted-foreground'}`}>
                                {isComplete ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                            </div>
                            <span className={`text-xs font-medium hidden sm:inline ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                                {step.label}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function App() {
    // Auth disabled — commented out for demo
    // const [token, setToken] = useState(localStorage.getItem('token'));
    // const [username, setUsername] = useState('');
    // const [password, setPassword] = useState('');
    // const [loginError, setLoginError] = useState('');

    const [step, setStep] = useState('intro');
    const [focusScore, setFocusScore] = useState(0.5);
    const [memoryScore, setMemoryScore] = useState(0.5);
    const [surveyData, setSurveyData] = useState(null);
    const [result, setResult] = useState(null);

    // const handleLogin = async (e) => { ... };

    const handleLogout = () => {
        setStep('intro');
        setFocusScore(0.5);
        setMemoryScore(0.5);
        setSurveyData(null);
        setResult(null);
    };

    const handleFocusComplete = (score) => {
        setFocusScore(score);
        setStep('memory');
    };

    const handleMemoryComplete = (score) => {
        setMemoryScore(score);
        setStep('survey');
    };

    const handleSurveyComplete = (data) => {
        setSurveyData(data);
        setStep('proctor');
    };

    const handleProctorComplete = async (proctorRatings) => {
        const features = new Array(14).fill(0.5);

        // Game scores
        features[0] = focusScore;
        features[1] = memoryScore;

        // Survey fields (already normalized 0-1)
        features[2] = surveyData.sleep;
        features[6] = surveyData.substance;
        features[7] = surveyData.diet;
        features[8] = surveyData.academic;

        // Voice prosody
        features[4] = surveyData.prosody?.anxiety ?? 0.5;
        features[5] = surveyData.prosody?.isolation ?? 0.5;

        // Proctor observations (normalized 0-1)
        features[3]  = proctorRatings.developmentalStage;
        features[9]  = proctorRatings.familyHistory;
        features[10] = proctorRatings.bullyingExposure;
        features[11] = proctorRatings.safetyPerception;
        features[12] = proctorRatings.socialMonitoring;
        features[13] = proctorRatings.physicalActivity;

        console.log('Submitting features to quantum backend:', features);
        setStep('calculating');
        await runQuantumReferral(features);
    };

    const runQuantumReferral = async (features) => {
        try {
            const response = await axios.post(`${BACKEND_URL}/predict`, {
                features: features
            }, {
                timeout: 30000
            });
            setResult(response.data);
            setStep('result');
        } catch (err) {
            console.error(err);
            setResult({ error: true, message: err.code === 'ECONNABORTED' ? 'Request timed out. The quantum backend may be starting up — please try again.' : 'Error contacting Quantum Core. Please try again.' });
            setStep('result');
        }
    };

    const handleNewAssessment = () => {
        setStep('intro');
        setFocusScore(0.5);
        setMemoryScore(0.5);
        setSurveyData(null);
        setResult(null);
    };

    // Login screen disabled for demo
    // if (!token) { ... }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            {/* Header */}
            <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between max-w-4xl">
                    <div className="flex items-center gap-2">
                        <Brain className="text-primary w-6 h-6" />
                        <h1 className="text-lg font-semibold">Quantum Mind</h1>
                    </div>
                    <StepIndicator currentStep={step} />
                    <Button variant="ghost" size="icon" onClick={handleLogout} title="Reset">
                        <LogOut className="w-4 h-4" />
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-4xl">

                {/* Intro */}
                {step === 'intro' && (
                    <Card className="max-w-xl mx-auto mt-4 sm:mt-8">
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                    <HeartPulse className="w-8 h-8 text-primary" />
                                </div>
                            </div>
                            <CardTitle className="text-3xl font-display">Mental Health Assessment</CardTitle>
                            <CardDescription className="text-base mt-2">
                                Quantum-enhanced cognitive and behavioral screening for adolescent wellbeing.
                                This assessment uses games, voice analysis, and clinical input.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <Button onClick={() => setStep('focus')} size="lg" className="px-8">
                                Start Assessment
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Games */}
                {step === 'focus' && <NeuralStrike onComplete={handleFocusComplete} />}
                {step === 'memory' && <ReactorSabotage onComplete={handleMemoryComplete} />}

                {/* Survey */}
                {step === 'survey' && <SurveyForm onComplete={handleSurveyComplete} />}

                {/* Proctor */}
                {step === 'proctor' && (
                    <ProctorForm
                        focusScore={focusScore}
                        memoryScore={memoryScore}
                        surveyData={surveyData}
                        onComplete={handleProctorComplete}
                    />
                )}

                {/* Calculating */}
                {step === 'calculating' && (
                    <div className="text-center mt-20">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                        <h3 className="text-xl font-display">Analyzing Quantum State</h3>
                        <p className="text-muted-foreground mt-2">Running variational quantum circuit...</p>
                    </div>
                )}

                {/* Error State */}
                {step === 'result' && result?.error && (
                    <div className="text-center mt-20 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                            <Info className="w-8 h-8 text-destructive" />
                        </div>
                        <h3 className="text-xl font-display">Assessment Failed</h3>
                        <p className="text-muted-foreground">{result.message}</p>
                        <Button onClick={handleNewAssessment} variant="outline" className="mt-4">
                            Try Again
                        </Button>
                    </div>
                )}

                {/* Results */}
                {step === 'result' && result && !result.error && (
                    <div className="space-y-6">

                        {/* Main Metric Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Depression Risk */}
                            <Card className="border-l-4 border-l-accent-lavender">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm font-medium text-muted-foreground">Depression Risk</p>
                                        <HeartPulse className="w-4 h-4 text-accent-lavender" />
                                    </div>
                                    <p className="text-3xl font-bold">
                                        {result.depression_percentage?.toFixed(1) || (result.depression_probability * 100).toFixed(1)}%
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">Probability of depressive symptoms</p>
                                </CardContent>
                            </Card>

                            {/* Overall Risk */}
                            <Card className="border-l-4 border-l-accent-teal">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm font-medium text-muted-foreground">Overall Risk</p>
                                        <Activity className="w-4 h-4 text-accent-teal" />
                                    </div>
                                    <p className="text-3xl font-bold">
                                        {result.risk_percentage?.toFixed(1) || (result.risk_probability * 100).toFixed(1)}%
                                    </p>
                                    <Badge variant={
                                        result.risk_tier === 'Crisis' ? 'destructive' :
                                        result.risk_tier === 'High' ? 'destructive' :
                                        result.risk_tier === 'Moderate' ? 'secondary' : 'outline'
                                    } className="mt-1">
                                        {result.risk_tier} Risk
                                    </Badge>
                                    {/* Risk Trajectory */}
                                    {result.tier_context && (
                                        <div className="mt-3 pt-3 border-t border-border">
                                            <div className="flex h-1 rounded-full overflow-hidden">
                                                <div className="flex-[40] bg-green-500/60" />
                                                <div className="flex-[30] bg-yellow-500/60" />
                                                <div className="flex-[15] bg-orange-500/60" />
                                                <div className="flex-[15] bg-red-500/60" />
                                            </div>
                                            <div className="relative h-2 -mt-1.5">
                                                <div className="absolute w-2.5 h-2.5 bg-white rounded-full shadow-sm shadow-white/50 -translate-x-1/2"
                                                    style={{ left: `${Math.min(100, result.risk_probability * 100)}%` }} />
                                            </div>
                                            <div className="flex justify-between text-[10px] mt-1">
                                                {result.tier_context.prev_tier_name && (
                                                    <span className="text-green-500">{result.tier_context.points_above_prev_tier}pts above {result.tier_context.prev_tier_name}</span>
                                                )}
                                                {result.tier_context.next_tier_name && (
                                                    <span className="text-red-500 ml-auto">{result.tier_context.points_to_next_tier}pts from {result.tier_context.next_tier_name}</span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Severity */}
                            <Card className={`border-l-4 ${
                                result.severity?.color === 'red' ? 'border-l-accent-rose' :
                                result.severity?.color === 'orange' ? 'border-l-accent-warm' :
                                result.severity?.color === 'yellow' ? 'border-l-accent-gold' : 'border-l-accent-teal'
                            }`}>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm font-medium text-muted-foreground">Severity</p>
                                        {(result.severity?.level === 'Critical' || result.severity?.level === 'Severe')
                                            ? <AlertTriangle className="w-4 h-4 text-destructive" />
                                            : <CheckCircle className="w-4 h-4 text-green-600" />
                                        }
                                    </div>
                                    <p className={`text-3xl font-bold ${
                                        result.severity?.color === 'red' ? 'text-accent-rose' :
                                        result.severity?.color === 'orange' ? 'text-accent-warm' :
                                        result.severity?.color === 'yellow' ? 'text-accent-gold' : 'text-accent-teal'
                                    }`}>
                                        {result.severity?.level || 'Mild'}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">{result.severity?.recommendation}</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Critical/Severe Alert */}
                        {result.severity && (result.severity.level === 'Critical' || result.severity.level === 'Severe') && (
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Important Recommendation</AlertTitle>
                                <AlertDescription>{result.severity.recommendation}</AlertDescription>
                            </Alert>
                        )}

                        {/* Feature Contributions */}
                        {result.feature_contributions && result.feature_contributions.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-primary" />
                                        Feature Contributions
                                    </CardTitle>
                                    <CardDescription>Gradient-based attribution from the quantum circuit</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-red-500 uppercase tracking-wider font-semibold mb-3">Risk Drivers</p>
                                            <div className="space-y-2">
                                                {result.feature_contributions
                                                    .filter(c => c.direction === 'risk' && c.contribution_pct > 2)
                                                    .map((c, i) => (
                                                        <div key={i} className="p-2.5 rounded-lg bg-red-500/5 border-l-3 border-red-500">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm font-medium">{c.name}</span>
                                                                <span className="text-xs text-red-500 font-mono">+{c.contribution_pct}%</span>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground">Score: {c.rating}/5</p>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-green-500 uppercase tracking-wider font-semibold mb-3">Protective Factors</p>
                                            <div className="space-y-2">
                                                {result.feature_contributions
                                                    .filter(c => c.direction === 'protective' && c.contribution_pct > 2)
                                                    .map((c, i) => (
                                                        <div key={i} className="p-2.5 rounded-lg bg-green-500/5 border-l-3 border-green-500">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm font-medium">{c.name}</span>
                                                                <span className="text-xs text-green-500 font-mono">-{c.contribution_pct}%</span>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground">Score: {c.rating}/5</p>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Data Source Transparency */}
                        {result.feature_report && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Info className="w-4 h-4 text-primary" />
                                        Data Sources
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {(() => {
                                        const sources = result.feature_report.reduce((acc, f) => {
                                            const key = f.source === 'game' || f.source === 'survey' ? 'measured' :
                                                        f.source === 'biometric' ? 'biometric' :
                                                        f.source === 'proctor' ? 'proctor' : 'estimated';
                                            acc[key] = (acc[key] || 0) + 1;
                                            return acc;
                                        }, {});
                                        const total = 14;
                                        const items = [
                                            { label: 'Game/Survey', count: sources.measured || 0, color: '#22c55e' },
                                            { label: 'Voice Biometric', count: sources.biometric || 0, color: '#3b82f6' },
                                            { label: 'Proctor Input', count: sources.proctor || 0, color: '#f59e0b' },
                                            { label: 'Estimated', count: sources.estimated || 0, color: '#6b7280' },
                                        ].filter(i => i.count > 0);

                                        let offset = 0;
                                        const circumference = 2 * Math.PI * 15.915;

                                        return (
                                            <div className="flex items-center gap-8">
                                                <div className="relative w-24 h-24 flex-shrink-0">
                                                    <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                                                        {items.map((item, i) => {
                                                            const pct = (item.count / total) * 100;
                                                            const dashArray = `${pct} ${100 - pct}`;
                                                            const dashOffset = -offset;
                                                            offset += pct;
                                                            return (
                                                                <circle key={i} cx="18" cy="18" r="15.915" fill="none"
                                                                    stroke={item.color} strokeWidth="3"
                                                                    strokeDasharray={dashArray}
                                                                    strokeDashoffset={dashOffset} />
                                                            );
                                                        })}
                                                    </svg>
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                        <span className="text-lg font-bold">{total}</span>
                                                        <span className="text-[8px] text-muted-foreground">features</span>
                                                    </div>
                                                </div>
                                                <div className="flex-1 space-y-2">
                                                    {items.map((item, i) => (
                                                        <div key={i} className="flex items-center gap-2 text-sm">
                                                            <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: item.color }} />
                                                            <span className="text-muted-foreground">{item.count} {item.label}</span>
                                                            <span className="text-muted-foreground/50 ml-auto text-xs">{Math.round((item.count / total) * 100)}%</span>
                                                        </div>
                                                    ))}
                                                    {result.summary && (
                                                        <div className="pt-1 border-t border-border text-xs text-destructive">
                                                            {result.summary.concerning_features} concerning features
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </CardContent>
                            </Card>
                        )}

                        {/* Concerning Features with Clinical Notes */}
                        {result.clinical_notes && result.clinical_notes.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-destructive" />
                                        Concerning Features
                                    </CardTitle>
                                    <CardDescription>AI-generated clinical context for flagged indicators</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {result.clinical_notes.map((note, i) => {
                                        const feature = result.feature_report?.find(f => f.name === note.feature_name);
                                        return (
                                            <div key={i} className="p-3 rounded-lg border border-destructive/20 bg-destructive/5">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-semibold text-sm">{note.feature_name}</span>
                                                    {feature && (
                                                        <span className="text-sm font-bold text-red-600">{feature.rating}/5</span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground">{note.plain_note}</p>
                                                <details className="mt-2">
                                                    <summary className="text-xs text-primary cursor-pointer hover:underline">Show Clinical Details</summary>
                                                    <p className="text-xs text-muted-foreground mt-1 pl-3 border-l-2 border-primary/30 italic">{note.clinical_note}</p>
                                                </details>
                                            </div>
                                        );
                                    })}
                                </CardContent>
                            </Card>
                        )}

                        {/* Feature Report */}
                        {result.feature_report && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Brain className="w-4 h-4 text-primary" />
                                        Feature Analysis
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Tabs defaultValue={(() => {
                                        const categories = ['Neurocognitive', 'Emotional', 'Lifestyle', 'Environmental', 'Behavioral', 'Genetic', 'Demographic'];
                                        return categories.find(c => result.feature_report.some(f => f.category === c)) || 'Neurocognitive';
                                    })()}>
                                        <TabsList className="flex flex-wrap h-auto gap-1 mb-4 overflow-x-auto">
                                            {['Neurocognitive', 'Emotional', 'Lifestyle', 'Environmental', 'Behavioral', 'Genetic', 'Demographic']
                                                .filter(cat => result.feature_report.some(f => f.category === cat))
                                                .map(cat => (
                                                    <TabsTrigger key={cat} value={cat} className="text-xs">
                                                        {cat}
                                                    </TabsTrigger>
                                                ))
                                            }
                                        </TabsList>

                                        {['Neurocognitive', 'Emotional', 'Lifestyle', 'Environmental', 'Behavioral', 'Genetic', 'Demographic'].map(category => {
                                            const features = result.feature_report.filter(f => f.category === category);
                                            if (features.length === 0) return null;

                                            return (
                                                <TabsContent key={category} value={category} className="space-y-3">
                                                    {features.map(feature => (
                                                        <div key={feature.index} className="p-4 rounded-lg border bg-muted/30">
                                                            <div className="flex items-start justify-between mb-2">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <span className="font-semibold text-sm">{feature.name}</span>
                                                                        {feature.health_indicator === 'good' && <CheckCircle className="w-3.5 h-3.5 text-green-500" />}
                                                                        {feature.health_indicator === 'concerning' && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
                                                                        {feature.health_indicator === 'moderate' && <Minus className="w-3.5 h-3.5 text-yellow-500" />}
                                                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                                                            {feature.status === 'measured' ? 'Measured' :
                                                                             feature.status === 'proctor' ? 'Proctor' : 'Estimated'}
                                                                        </Badge>
                                                                    </div>
                                                                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                                                                </div>
                                                                <span className={`text-lg font-bold ml-4 ${
                                                                    feature.rating >= 4 ? 'text-green-600' :
                                                                    feature.rating >= 3 ? 'text-yellow-600' : 'text-red-600'
                                                                }`}>
                                                                    {feature.rating}/5
                                                                </span>
                                                            </div>
                                                            <Progress
                                                                value={(feature.rating / 5) * 100}
                                                                className="h-1.5"
                                                                indicatorClassName={
                                                                    feature.rating >= 4 ? 'bg-green-500' :
                                                                    feature.rating >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                                                                }
                                                            />
                                                        </div>
                                                    ))}
                                                </TabsContent>
                                            );
                                        })}
                                    </Tabs>
                                </CardContent>
                            </Card>
                        )}

                        {/* Technical Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm text-muted-foreground">Technical Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs font-mono text-muted-foreground">
                                    <div>
                                        <p className="mb-1">Z-Expectation</p>
                                        <p className="font-semibold text-foreground">{result.quantum_raw?.toFixed(6)}</p>
                                    </div>
                                    <div>
                                        <p className="mb-1">Risk Prob</p>
                                        <p className="font-semibold text-foreground">{result.risk_probability?.toFixed(4)}</p>
                                    </div>
                                    <div>
                                        <p className="mb-1">Depression Prob</p>
                                        <p className="font-semibold text-foreground">{result.depression_probability?.toFixed(4)}</p>
                                    </div>
                                    <div>
                                        <p className="mb-1">Threshold</p>
                                        <p className="font-semibold text-foreground">{result.decision_threshold ?? 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="mb-1">Confidence</p>
                                        <p className="font-semibold text-foreground">
                                            {result.confidence_band
                                                ? `${(result.risk_probability * 100).toFixed(1)}% ± ${(result.confidence_band.spread / 2).toFixed(1)}%`
                                                : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Reset */}
                        <div className="text-center pb-8">
                            <Button onClick={handleNewAssessment} variant="outline" size="lg">
                                Start New Assessment
                            </Button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
