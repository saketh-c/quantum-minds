import { useState } from 'react';
import HumeVoice from './HumeVoice';

export default function SurveyForm({ onComplete }) {
    const [formData, setFormData] = useState({
        sleep: 3,
        diet: 3,
        substance: 1, // 1=Low risk
        academic: 3,
        family: 1,
    });

    const [prosodyData, setProsodyData] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [extractedRatings, setExtractedRatings] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!prosodyData) {
            alert("Please activate the Voice Analysis and describe your answers aloud.");
            return;
        }

        // Normalize 1-5 scale to 0-1
        // 1 -> 0.0, 3 -> 0.5, 5 -> 1.0
        const normalize = (val) => (val - 1) / 4;

        const normalizedData = {
            sleep: normalize(formData.sleep),
            diet: normalize(formData.diet),
            substance: normalize(formData.substance),
            academic: normalize(formData.academic),
            family: normalize(formData.family),
            prosody: prosodyData.prosody || prosodyData
        };

        onComplete(normalizedData);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: parseInt(e.target.value) });
    };

    const handleVoiceAnalysis = (data) => {
        setProsodyData(data);
        
        // Auto-fill form with extracted ratings (convert 1-10 scale to 1-5 scale)
        if (data.ratings) {
            const ratings = data.ratings;
            const newFormData = { ...formData };
            
            // Convert 1-10 scale to 1-5 scale: (value - 1) * 4/9 + 1, then round
            if (ratings.sleep) {
                newFormData.sleep = Math.round(((ratings.sleep - 1) * 4 / 9) + 1);
                newFormData.sleep = Math.max(1, Math.min(5, newFormData.sleep));
            }
            if (ratings.academic) {
                newFormData.academic = Math.round(((ratings.academic - 1) * 4 / 9) + 1);
                newFormData.academic = Math.max(1, Math.min(5, newFormData.academic));
            }
            if (ratings.diet) {
                newFormData.diet = Math.round(((ratings.diet - 1) * 4 / 9) + 1);
                newFormData.diet = Math.max(1, Math.min(5, newFormData.diet));
            }
            
            setFormData(newFormData);
            setExtractedRatings(ratings);
        }
    };

    return (
        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Calibration & Voice
            </h2>
            <p className="text-slate-400 text-center mb-8 text-sm">
                Please <strong>start the microphone</strong> and explain your ratings aloud as you select them.
                {extractedRatings && (
                    <span className="block mt-2 text-green-400 font-semibold">
                        ✓ Ratings extracted from your voice! Form auto-filled below.
                    </span>
                )}
            </p>

            {/* Voice Control - Always visible at top */}
            <div className="mb-8 p-4 bg-slate-900 rounded-xl border border-slate-700">
                <HumeVoice onAnalysisComplete={handleVoiceAnalysis} onRecordingStateChange={setIsRecording} />
            </div>

            <div className={`space-y-10 transition-opacity duration-500 ${isRecording ? 'opacity-100' : 'opacity-50 pointer-events-none blur-[1px]'}`}>
                {/* Helper Component for Rating */}
                {[
                    {
                        id: 'sleep',
                        label: 'Sleep Quality',
                        low: 'Poor',
                        high: 'Excellent',
                        color: 'bg-green-500',
                        hover: 'hover:border-green-200'
                    },
                    {
                        id: 'academic',
                        label: 'Academic Pressure',
                        low: 'None',
                        high: 'Overwhelming',
                        color: 'bg-yellow-500',
                        hover: 'hover:border-yellow-200'
                    },
                    {
                        id: 'diet',
                        label: 'Diet Quality',
                        low: 'Unhealthy',
                        high: 'Healthy',
                        color: 'bg-blue-500',
                        hover: 'hover:border-blue-200'
                    }
                ].map((q) => (
                    <div key={q.id}>
                        <label className="text-slate-700 font-bold mb-4 block text-lg">{q.label}</label>

                        <div className="flex justify-between gap-2 mb-2">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => handleChange({ target: { name: q.id, value: num } })}
                                    className={`
                                  flex-1 aspect-square rounded-xl font-bold text-xl transition-all shadow-sm border-2
                                  ${formData[q.id] === num
                                            ? `${q.color} border-transparent text-white shadow-lg scale-105`
                                            : `bg-white border-slate-100 text-slate-400 ${q.hover} hover:bg-slate-50`
                                        }
                              `}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-between text-sm text-slate-400 font-medium px-1">
                            <span>{q.low}</span>
                            <span>{q.high}</span>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={handleSubmit}
                disabled={!prosodyData}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-4 rounded-xl font-bold mt-8 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
                {prosodyData ? "Generate Quantum Diagnosis" : "Please Complete Voice Analysis"}
            </button>
        </div>
    );
}

