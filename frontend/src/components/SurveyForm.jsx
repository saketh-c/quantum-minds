import { useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import HumeVoice from './HumeVoice';

const QUESTIONS = [
    {
        id: 'sleep',
        label: 'Sleep Quality',
        description: 'How well have you been sleeping over the past two weeks?',
        options: ['Very poor', 'Poor', 'Fair', 'Good', 'Excellent'],
    },
    {
        id: 'substance',
        label: 'Substance Risk',
        description: 'Any use of alcohol, tobacco, or other substances?',
        options: ['Daily use', 'Weekly use', 'Occasional', 'Rarely', 'Never'],
    },
    {
        id: 'diet',
        label: 'Diet & Nutrition',
        description: 'How would you rate your eating habits?',
        options: ['Very poor', 'Poor', 'Fair', 'Good', 'Excellent'],
    },
    {
        id: 'academic',
        label: 'Academic Pressure',
        description: 'How much stress do you feel from school or academic work?',
        options: ['Overwhelming', 'High', 'Moderate', 'Low', 'None'],
    },
];

export default function SurveyForm({ onComplete }) {
    const [formData, setFormData] = useState({
        sleep: 3,
        substance: 1,
        diet: 3,
        academic: 3,
    });
    const [prosody, setProsody] = useState(null);
    const [transcript, setTranscript] = useState('');

    const handleRating = (questionId, value) => {
        setFormData({ ...formData, [questionId]: value });
    };

    const handleProsodyUpdate = (scores) => {
        setProsody(scores);
    };

    const handleTranscriptUpdate = (text) => {
        setTranscript(text);
    };

    const handleSubmit = () => {
        const normalize = (val) => (val - 1) / 4;
        onComplete({
            sleep: normalize(formData.sleep),
            substance: normalize(formData.substance),
            diet: normalize(formData.diet),
            academic: normalize(formData.academic),
            prosody: prosody || { anxiety: 0.1, isolation: 0.1 },
            transcript,
        });
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <ClipboardList className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg font-display">Self-Report Survey</CardTitle>
                    </div>
                    <CardDescription>
                        Answer each question honestly. Your responses help calibrate the assessment model.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    {QUESTIONS.map((question) => (
                        <div key={question.id} className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-base font-semibold">{question.label}</Label>
                                <Badge variant="outline" className="text-sm font-mono">
                                    {formData[question.id]}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{question.description}</p>

                            <div className="flex items-center gap-2 sm:gap-3">
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => handleRating(question.id, num)}
                                        className={`
                                            flex-1 h-11 min-w-[44px] rounded-lg font-semibold text-sm transition-all border
                                            ${formData[question.id] === num
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
                                <span>{question.options[0]}</span>
                                <span>{question.options[4]}</span>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Voice Analysis */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-display">Voice Sample</CardTitle>
                    <CardDescription>
                        Record a brief voice sample. Speak about how you've been feeling recently (30-60 seconds).
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <HumeVoice
                        onProsodyUpdate={handleProsodyUpdate}
                        onTranscriptUpdate={handleTranscriptUpdate}
                    />
                </CardContent>
            </Card>

            <Button onClick={handleSubmit} className="w-full gap-2" size="lg">
                <ClipboardList className="w-5 h-5" />
                Continue to Clinical Review
            </Button>
        </div>
    );
}
