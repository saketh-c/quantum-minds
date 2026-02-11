import { Heart, AlertTriangle, Shield, Users, Clock, Smartphone, Brain, TrendingDown } from 'lucide-react';

function StatCard({ value, label, description, color = 'red' }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className={`text-3xl font-black text-${color}-600 mb-1`}>{value}</div>
            <div className="font-bold text-slate-800 text-sm">{label}</div>
            <div className="text-xs text-slate-500 mt-1">{description}</div>
        </div>
    );
}

export default function StudentImpact() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 mb-2">Student Impact</h1>
                <p className="text-slate-600">How quantum-enhanced mental health screening can help students get support earlier.</p>
            </div>

            {/* The Crisis */}
            <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" /> The Student Mental Health Crisis
                </h2>
                <p className="text-red-800 text-sm mb-4">
                    Student mental health is at a critical inflection point. The data paints a stark picture of a system failing its most vulnerable population.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard value="1 in 3" label="Students Affected" description="College students experience significant anxiety or depression" />
                    <StatCard value="64%" label="Go Untreated" description="Students with mental health issues never receive professional help" />
                    <StatCard value="11 yrs" label="Average Delay" description="Time between onset of symptoms and first treatment" />
                    <StatCard value="120%" label="Increase" description="Rise in student depression since 2013 (pre-COVID)" />
                </div>
            </div>

            {/* Barriers */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Why Students Don't Get Help</h2>
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                    {[
                        { icon: Clock, title: 'Time & Access', desc: 'University counseling centers are overwhelmed. Average wait times are 2-4 weeks. Many students can\'t schedule around classes or work. By the time they get an appointment, the crisis may have passed — or escalated.', color: 'amber' },
                        { icon: Users, title: 'Stigma', desc: 'Despite progress, mental health stigma persists. 40% of students who considered seeking help didn\'t because they feared being judged. Male students are particularly affected — they\'re 2x less likely to seek help.', color: 'red' },
                        { icon: Shield, title: 'Self-Awareness', desc: 'Many students don\'t recognize their symptoms as a mental health issue. They normalize chronic stress, poor sleep, and social withdrawal as "just college." By the time they realize something is wrong, they\'re in crisis.', color: 'violet' },
                        { icon: TrendingDown, title: 'Cost', desc: 'Therapy averages $100-250/session. Even with insurance, co-pays and caps limit access. Marginalized students — first-generation, low-income, international — are disproportionately affected.', color: 'emerald' },
                    ].map((barrier, i) => (
                        <div key={i} className={`bg-${barrier.color}-50 border border-${barrier.color}-200 rounded-lg p-4`}>
                            <div className="flex items-center gap-2 mb-2">
                                <barrier.icon className={`w-5 h-5 text-${barrier.color}-600`} />
                                <h3 className={`font-bold text-${barrier.color}-900`}>{barrier.title}</h3>
                            </div>
                            <p className={`text-${barrier.color}-800 text-xs`}>{barrier.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* How Quantum Mind Helps */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-500" /> How Quantum Mind Addresses These Barriers
                </h2>
                <div className="space-y-6 text-sm">
                    <div className="border-l-4 border-blue-400 pl-4">
                        <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                            <Smartphone className="w-4 h-4 text-blue-600" /> Smartphone Accessibility
                        </h3>
                        <p className="text-slate-700">
                            Quantum Mind runs entirely in a web browser — no app download, no appointment scheduling, no waiting room. A student can complete the entire assessment in under 10 minutes from their phone. 24/7, anywhere, free.
                        </p>
                    </div>

                    <div className="border-l-4 border-violet-400 pl-4">
                        <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-violet-600" /> Reduced Stigma Through Gamification
                        </h3>
                        <p className="text-slate-700">
                            Instead of clinical questionnaires that feel like "tests," Quantum Mind uses cognitive games (Stroop test, memory game) and natural voice conversation. Students engage with what feels like a game or chat — not a psychiatric evaluation. This lowers the barrier to entry.
                        </p>
                    </div>

                    <div className="border-l-4 border-emerald-400 pl-4">
                        <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                            <Brain className="w-4 h-4 text-emerald-600" /> Multi-Modal Detection
                        </h3>
                        <p className="text-slate-700">
                            Traditional screening uses only self-reported surveys (PHQ-9, GAD-7). But students may not accurately report their symptoms. Quantum Mind combines three independent data sources:
                        </p>
                        <ul className="list-disc ml-5 mt-2 text-slate-600 space-y-1">
                            <li><strong>Cognitive performance</strong> — Objective measurement of attention and memory, bypassing self-report bias.</li>
                            <li><strong>Voice prosody</strong> — AI analyzes vocal patterns for anxiety and emotional withdrawal markers the student may not be aware of.</li>
                            <li><strong>Self-report</strong> — Traditional survey questions for lifestyle factors.</li>
                        </ul>
                    </div>

                    <div className="border-l-4 border-amber-400 pl-4">
                        <h3 className="font-bold text-slate-900 mb-1">Early Warning System</h3>
                        <p className="text-slate-700">
                            The triage model doesn't diagnose — it <strong>triages</strong>. It identifies students who may need support and provides graded risk levels (Low → Moderate → High → Crisis) with appropriate recommendations for each tier. This catches problems before they become crises.
                        </p>
                    </div>
                </div>
            </div>

            {/* Triage Tiers */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Risk Tiers & Recommended Actions</h2>
                <div className="space-y-4">
                    {[
                        { tier: 'Low Risk', range: '0-40%', color: 'green', action: 'Self-monitoring, wellness tips, lifestyle suggestions. Encourage periodic re-assessment.', desc: 'Student shows no significant risk indicators. Cognitive and emotional markers within normal range.' },
                        { tier: 'Moderate Risk', range: '40-70%', color: 'amber', action: 'Suggest peer support groups, wellness apps, campus resources. Re-assess in 2 weeks.', desc: 'Elevated indicators in some areas. May benefit from proactive support before symptoms worsen.' },
                        { tier: 'High Risk', range: '70-85%', color: 'orange', action: 'Strongly recommend counseling appointment. Provide crisis hotline numbers. Follow up within 48 hours.', desc: 'Multiple risk factors elevated. Strong indication of mental health difficulties requiring professional attention.' },
                        { tier: 'Crisis', range: '85-100%', color: 'red', action: 'Immediate resources displayed: 988 Suicide Hotline, Crisis Text Line, campus emergency. Flag for urgent follow-up.', desc: 'Severe risk indicators. Immediate intervention recommended. Student may be in acute distress.' },
                    ].map((t, i) => (
                        <div key={i} className={`bg-${t.color}-50 border border-${t.color}-200 rounded-lg p-4`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-${t.color}-900 font-bold`}>{t.tier}</span>
                                <span className={`text-xs px-2 py-1 rounded-full bg-${t.color}-200 text-${t.color}-900 font-mono font-bold`}>{t.range}</span>
                            </div>
                            <p className={`text-xs text-${t.color}-800 mb-2`}>{t.desc}</p>
                            <p className={`text-xs text-${t.color}-700`}><strong>Action:</strong> {t.action}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ethics */}
            <div className="bg-slate-900 text-white rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Ethical Considerations</h2>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-800 rounded-lg p-4">
                        <h4 className="text-blue-400 font-bold mb-2">This is NOT a Diagnosis</h4>
                        <p className="text-slate-300 text-xs">Quantum Mind is a screening/triage tool. It identifies students who may benefit from professional support. Only licensed professionals can diagnose mental health conditions.</p>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-4">
                        <h4 className="text-green-400 font-bold mb-2">Privacy First</h4>
                        <p className="text-slate-300 text-xs">Voice data is processed in real-time and not stored. Survey responses are not linked to identifiable information. JWT authentication ensures secure sessions. No data sold or shared.</p>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-4">
                        <h4 className="text-amber-400 font-bold mb-2">Bias Mitigation</h4>
                        <p className="text-slate-300 text-xs">The synthetic training data is generated to represent diverse demographics. However, real-world deployment requires validation across different populations, cultures, and languages.</p>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-4">
                        <h4 className="text-rose-400 font-bold mb-2">Human in the Loop</h4>
                        <p className="text-slate-300 text-xs">High-risk results always direct students to human professionals. The AI never replaces human judgment — it supplements it by identifying who needs attention most urgently.</p>
                    </div>
                </div>
            </div>

            {/* Vision */}
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-4">The Vision: Universal Mental Health Screening</h2>
                <p className="text-rose-100 mb-4">
                    Imagine a world where every student has access to free, instant, stigma-free mental health screening — powered by quantum computing on their smartphone. That's what Quantum Mind is working toward.
                </p>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                        <div className="font-bold mb-1">Phase 1: Prototype</div>
                        <p className="text-rose-100 text-xs">Current stage. Demonstrate feasibility of quantum-enhanced mental health triage. Science fair validation.</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                        <div className="font-bold mb-1">Phase 2: Validation</div>
                        <p className="text-rose-100 text-xs">Partner with university counseling centers for real-world pilot. IRB approval. Clinical validation studies.</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                        <div className="font-bold mb-1">Phase 3: Scale</div>
                        <p className="text-rose-100 text-xs">Deploy to K-12 and universities nationally. Integrate with existing health systems. Expand to workplace wellness.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
