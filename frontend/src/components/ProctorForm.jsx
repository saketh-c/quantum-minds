import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Brain, Activity, ClipboardList, Stethoscope } from 'lucide-react';

const PROCTOR_FIELDS = [
    {
        id: 'developmentalStage',
        label: 'Developmental Stage',
        description: 'Age-normalized pubertal/developmental stage',
        low: 'Early',
        high: 'Post-pubertal',
    },
    {
        id: 'familyHistory',
        label: 'Family History',
        description: 'Family history of mental health conditions',
        low: 'None known',
        high: 'Multiple conditions',
    },
    {
        id: 'bullyingExposure',
        label: 'Bullying Exposure',
        description: 'Exposure to bullying or peer victimization',
        low: 'None observed',
        high: 'Severe / ongoing',
    },
    {
        id: 'safetyPerception',
        label: 'Safety Perception',
        description: 'Perceived safety in environment (home, school)',
        low: 'Unsafe',
        high: 'Very safe',
    },
    {
        id: 'socialMonitoring',
        label: 'Social Monitoring',
        description: 'Level of social support and adult monitoring',
        low: 'Minimal',
        high: 'Strong network',
    },
    {
        id: 'physicalActivity',
        label: 'Physical Activity',
        description: 'Exercise and physical activity levels',
        low: 'Sedentary',
        high: 'Very active',
    },
];

export default function ProctorForm({ focusScore, memoryScore, surveyData, onComplete }) {
    const [ratings, setRatings] = useState({
        developmentalStage: 3,
        familyHistory: 3,
        bullyingExposure: 3,
        safetyPerception: 3,
        socialMonitoring: 3,
        physicalActivity: 3,
    });

    const handleSubmit = () => {
        const normalize = (val) => (val - 1) / 4;
        onComplete({
            developmentalStage: normalize(ratings.developmentalStage),
            familyHistory: normalize(ratings.familyHistory),
            bullyingExposure: normalize(ratings.bullyingExposure),
            safetyPerception: normalize(ratings.safetyPerception),
            socialMonitoring: normalize(ratings.socialMonitoring),
            physicalActivity: normalize(ratings.physicalActivity),
        });
    };

    const toDisplay = (val) => {
        if (val === undefined || val === null) return '—';
        return `${(val * 100).toFixed(0)}%`;
    };

    const toRating = (val) => {
        if (val === undefined || val === null) return '—';
        return Math.round(val * 4 + 1);
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            {/* Student Summary */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <ClipboardList className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg font-display">Student Assessment Summary</CardTitle>
                    </div>
                    <CardDescription>Review the data collected from the student before adding clinical observations.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="p-3 rounded-lg bg-muted/50">
                            <p className="text-xs text-muted-foreground mb-1">Focus Score</p>
                            <p className="text-lg font-semibold">{toDisplay(focusScore)}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50">
                            <p className="text-xs text-muted-foreground mb-1">Memory Score</p>
                            <p className="text-lg font-semibold">{toDisplay(memoryScore)}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50">
                            <p className="text-xs text-muted-foreground mb-1">Sleep Quality</p>
                            <p className="text-lg font-semibold">{toRating(surveyData?.sleep)}/5</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50">
                            <p className="text-xs text-muted-foreground mb-1">Diet Quality</p>
                            <p className="text-lg font-semibold">{toRating(surveyData?.diet)}/5</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50">
                            <p className="text-xs text-muted-foreground mb-1">Substance Risk</p>
                            <p className="text-lg font-semibold">{toRating(surveyData?.substance)}/5</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50">
                            <p className="text-xs text-muted-foreground mb-1">Academic Pressure</p>
                            <p className="text-lg font-semibold">{toRating(surveyData?.academic)}/5</p>
                        </div>
                    </div>

                    {surveyData?.prosody && (
                        <>
                            <Separator className="my-4" />
                            <div className="flex gap-3">
                                <Badge variant="outline" className="font-mono">
                                    Anxiety: {(surveyData.prosody.anxiety * 100).toFixed(0)}%
                                </Badge>
                                <Badge variant="outline" className="font-mono">
                                    Isolation: {(surveyData.prosody.isolation * 100).toFixed(0)}%
                                </Badge>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Proctor Clinical Observations */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Stethoscope className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg font-display">Clinical Observations</CardTitle>
                    </div>
                    <CardDescription>
                        Rate each factor based on your clinical assessment of the student. These values directly influence the quantum prediction model.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    {PROCTOR_FIELDS.map((field) => (
                        <div key={field.id} className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-base font-semibold">{field.label}</Label>
                                <Badge variant="outline" className="text-sm font-mono">
                                    {ratings[field.id]}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{field.description}</p>

                            <div className="flex items-center gap-2 sm:gap-3">
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => setRatings({ ...ratings, [field.id]: num })}
                                        className={`
                                            flex-1 h-11 min-w-[44px] rounded-lg font-semibold text-sm transition-all border
                                            ${ratings[field.id] === num
                                                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                                : 'bg-background text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground'
                                            }
                                        `}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-between text-xs text-muted-foreground px-1">
                                <span>{field.low}</span>
                                <span>{field.high}</span>
                            </div>
                        </div>
                    ))}

                    <Button onClick={handleSubmit} className="w-full gap-2" size="lg">
                        <Brain className="w-5 h-5" />
                        Run Quantum Prediction
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
