import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Plus, Trash2, Save, UploadCloud, FileText, Loader2, Calendar, Clock as ClockIcon, Mail, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CreateExam: React.FC = () => {
    const navigate = useNavigate();
    const [examData, setExamData] = useState({
        title: '',
        description: '',
        timeLimitMinutes: 60,
        marksPerQuestion: 1,
        price: 100,
        scheduleDate: '',
        scheduleTime: '',
        studentEmails: ''
    });
    const [questions, setQuestions] = useState<any[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [publishedCode, setPublishedCode] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [mode, setMode] = useState<'manual' | 'ai' | 'pdf'>('manual');
    const [aiTopic, setAiTopic] = useState('');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [, setRazorpayLoaded] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => setRazorpayLoaded(true);
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const addQuestion = () => {
        setQuestions([...questions, { type: 'MCQ', text: '', options: ['', '', '', ''], correctOptionIndex: 0 }]);
    };

    const handleAIGeneration = () => {
        if (!aiTopic) return alert("Please enter a topic for the AI.");
        setIsGenerating(true);
        // Mock AI LLM generation delay
        setTimeout(() => {
            const mockAIQuestions = [
                { type: 'MCQ', text: `What is the core concept of ${aiTopic}?`, options: ['Concept A', 'Concept B', 'Concept C', 'Concept D'], correctOptionIndex: 0 },
                { type: 'MCQ', text: `How do you implement ${aiTopic} in modern systems?`, options: ['Frameworks', 'Manual coding', 'Magic', 'Skipping it'], correctOptionIndex: 0 },
                { type: 'MCQ', text: `Which tool is best for ${aiTopic}?`, options: ['Tool 1', 'Tool 2', 'Tool 3', 'Tool 4'], correctOptionIndex: 1 },
            ];
            setQuestions([...questions, ...mockAIQuestions]);
            setIsGenerating(false);
            setMode('manual'); // switch back to let them edit the generated questions
        }, 2000);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            setUploadedFile(file);
            setIsGenerating(true);

            // Mock PDF Parsing and Question Extraction Delay
            setTimeout(() => {
                const mockExtractedQuestions = [
                    { type: 'MCQ', text: `[AI Generated from ${file.name}] What is the primary focus of this document?`, options: ['Topic A', 'Topic B', 'General Overview', 'None'], correctOptionIndex: 2 },
                    { type: 'MCQ', text: `[AI Generated from Section 2] Which of the following statements is true based on the provided theory?`, options: ['Statement 1', 'Statement 2', 'Statement 3', 'Statement 4'], correctOptionIndex: 1 },
                ];
                setQuestions([...questions, ...mockExtractedQuestions]);
                setIsGenerating(false);
                setMode('manual'); // Let user review extracted questions
                alert(`AI Successfully generated ${mockExtractedQuestions.length} questions based on the theory in ${file.name}!`);
            }, 3000);
        } else {
            alert("Please upload a valid .pdf file.");
        }
    };

    const handlePaymentAndPublish = () => {
        console.log("Initiating payment process...");

        if (!examData.title) {
            return alert("Please enter an Exam Title before publishing.");
        }
        if (questions.length === 0) {
            return alert("Please add at least one question to your exam.");
        }

        if (typeof (window as any).Razorpay === 'undefined') {
            console.error("Razorpay SDK not found on window object.");
            alert("Error: Razorpay Payment Gateway (SDK) is not loaded. Please ensure you have an active internet connection and that no ad-blockers are preventing the payment script from running.");
            return;
        }

        try {
            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID?.replace(/"/g, '') || 'rzp_test_SL3IjBDPgFjTAS',
                amount: examData.price * 100, // paise
                currency: 'INR',
                name: 'be-test Exams',
                description: `Hosting Fee for Exam: ${examData.title}`,
                handler: function (response: any) {
                    console.log("Payment Success: ", response);
                    saveExam();
                },
                prefill: {
                    name: 'Admin User',
                    email: 'admin@example.com',
                },
                theme: { color: '#4f46e5' },
                modal: {
                    ondismiss: function () {
                        console.log("Payment window closed by user");
                    }
                }
            };

            console.log("Opening Razorpay with key:", options.key);
            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error("Failed to initialize Razorpay:", err);
            alert("Crisis: Failed to initialize the payment gateway. Check browser console for details.");
        }
    };

    const saveExam = () => {
        // Generate a unique 8-character ID
        const uniqueId = Math.random().toString(36).substring(2, 10).toUpperCase();
        console.log("Saving exam to database:", { exam: examData, questions, code: uniqueId });
        setPublishedCode(uniqueId);
    };

    const copyToClipboard = () => {
        if (publishedCode) {
            navigator.clipboard.writeText(publishedCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <main style={{ flex: 1, padding: 'var(--space-4)', maxWidth: 800, margin: '0 auto', width: '100%' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: 'var(--space-4)' }}>Create New Exam</h1>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <GlassCard style={{ marginBottom: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        <h3>Exam Settings</h3>
                        <Input label="Exam Title" placeholder="Final Semester Examination" value={examData.title} onChange={e => setExamData({ ...examData, title: e.target.value })} />
                        <Input label="Description" placeholder="Theoretical concepts of physics..." value={examData.description} onChange={e => setExamData({ ...examData, description: e.target.value })} />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                            <Input
                                type="date"
                                label="Schedule Date"
                                icon={<Calendar size={18} />}
                                value={examData.scheduleDate}
                                onChange={e => setExamData({ ...examData, scheduleDate: e.target.value })}
                            />
                            <Input
                                type="time"
                                label="Start Time"
                                icon={<ClockIcon size={18} />}
                                value={examData.scheduleTime}
                                onChange={e => setExamData({ ...examData, scheduleTime: e.target.value })}
                            />
                        </div>

                        <Input
                            label="Direct Invite (Student Email IDs)"
                            placeholder="student1@gmail.com, student2@gmail.com"
                            icon={<Mail size={18} />}
                            value={examData.studentEmails}
                            onChange={e => setExamData({ ...examData, studentEmails: e.target.value })}
                        />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-3)' }}>
                            <Input type="number" label="Time Limit (Mins)" value={examData.timeLimitMinutes} onChange={e => setExamData({ ...examData, timeLimitMinutes: parseInt(e.target.value) || 0 })} />
                            <Input type="number" label="Marks / Question" value={examData.marksPerQuestion} onChange={e => setExamData({ ...examData, marksPerQuestion: parseInt(e.target.value) || 0 })} />
                            <Input type="number" label="Hosting Fee (INR)" value={examData.price} onChange={e => setExamData({ ...examData, price: parseInt(e.target.value) || 0 })} />
                        </div>
                    </GlassCard>

                    <GlassCard style={{ marginBottom: 'var(--space-4)' }}>
                        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                            <Button variant={mode === 'manual' ? 'primary' : 'outline'} onClick={() => setMode('manual')}>
                                Manual Entry
                            </Button>
                            <Button variant={mode === 'ai' ? 'primary' : 'outline'} onClick={() => setMode('ai')}>
                                AI Generation
                            </Button>
                            <Button variant={mode === 'pdf' ? 'primary' : 'outline'} onClick={() => setMode('pdf')}>
                                AI Theory-to-Questions (PDF)
                            </Button>
                        </div>

                        {mode === 'ai' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                <p style={{ color: 'var(--color-text-muted)' }}>Describe the exam topic, and our AI will generate questions for you.</p>
                                <Input label="Topic Description" placeholder="e.g. Advanced JavaScript Closures and ES6" value={aiTopic} onChange={e => setAiTopic(e.target.value)} />
                                <Button variant="primary" isLoading={isGenerating} onClick={handleAIGeneration}>
                                    Generate Draft Questions ✨
                                </Button>
                            </div>
                        )}

                        {mode === 'pdf' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', alignItems: 'center', padding: 'var(--space-4)', border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                                <FileText size={48} color="var(--color-primary)" style={{ opacity: 0.5 }} />
                                <h4 style={{ marginBottom: 0 }}>Train AI on your Document</h4>
                                <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', maxWidth: 400 }}>Upload a PDF containing theory, syllabus, or topics. Our AI will analyze the text and automatically generate relevant multiple-choice questions for your exam.</p>

                                {isGenerating ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-primary)', fontWeight: 'bold' }}>
                                        <Loader2 size={24} className="spin" /> AI is reading your document and crafting questions...
                                    </div>
                                ) : (
                                    <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--color-primary)', color: '#fff', padding: '12px 24px', borderRadius: 'var(--radius-md)', fontWeight: 'bold' }}>
                                        <UploadCloud size={20} /> Upload Theory PDF
                                        <input type="file" accept="application/pdf" style={{ display: 'none' }} onChange={handleFileUpload} />
                                    </label>
                                )}
                                {uploadedFile && !isGenerating && <span style={{ fontSize: 12, color: 'var(--color-success)' }}>Successfully Trained on: {uploadedFile.name}</span>}
                            </div>
                        )}
                    </GlassCard>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                        <h3>Questions ({questions.length})</h3>
                        <Button variant="outline" size="sm" onClick={addQuestion}>
                            <Plus size={16} /> Add Question
                        </Button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        {questions.map((q, qIndex) => (
                            <GlassCard key={qIndex} style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setQuestions(questions.filter((_, i) => i !== qIndex))}
                                    style={{ position: 'absolute', top: 16, right: 16, color: 'var(--color-danger)' }}
                                >
                                    <Trash2 size={18} />
                                </button>
                                <div style={{ marginBottom: 'var(--space-3)' }}>
                                    <Input label={`Question ${qIndex + 1}`} value={q.text} onChange={e => {
                                        const newQ = [...questions];
                                        newQ[qIndex].text = e.target.value;
                                        setQuestions(newQ);
                                    }} />
                                </div>

                                {q.type === 'MCQ' && (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
                                        {q.options.map((opt: string, optIndex: number) => (
                                            <div key={optIndex} style={{ display: 'flex', gap: 'var(--space-1)', alignItems: 'center' }}>
                                                <input type="radio" name={`correct-${qIndex}`} checked={q.correctOptionIndex === optIndex} onChange={() => {
                                                    const newQ = [...questions];
                                                    newQ[qIndex].correctOptionIndex = optIndex;
                                                    setQuestions(newQ);
                                                }} />
                                                <Input placeholder={`Option ${optIndex + 1}`} value={opt} onChange={e => {
                                                    const newQ = [...questions];
                                                    newQ[qIndex].options[optIndex] = e.target.value;
                                                    setQuestions(newQ);
                                                }} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </GlassCard>
                        ))}
                    </div>

                    <div style={{ marginTop: 'var(--space-4)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
                        <Button variant="ghost" onClick={() => navigate('/admin')}>Cancel</Button>
                        <Button variant="primary" onClick={handlePaymentAndPublish}>
                            <Save size={18} /> Pay ₹{examData.price} & Publish
                        </Button>
                    </div>

                    {publishedCode && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
                        >
                            <GlassCard style={{ maxWidth: 400, width: '100%', textAlign: 'center', padding: 'var(--space-6)' }}>
                                <div style={{ width: 64, height: 64, background: 'var(--color-success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)' }}>
                                    <Check size={32} color="white" />
                                </div>
                                <h2 style={{ marginBottom: 'var(--space-1)' }}>Exam Published!</h2>
                                <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>Your exam is scheduled for {examData.scheduleDate} at {examData.scheduleTime}. Share this code with your students:</p>

                                <div style={{ display: 'flex', gap: 8, background: 'var(--color-surface)', padding: 12, borderRadius: 12, border: '1px solid var(--color-border)', marginBottom: 'var(--space-6)', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: 2, color: 'var(--color-primary)' }}>{publishedCode}</span>
                                    <Button size="sm" variant="ghost" onClick={copyToClipboard}>
                                        {copied ? <Check size={18} color="var(--color-success)" /> : <Copy size={18} />}
                                    </Button>
                                </div>

                                <Button variant="primary" style={{ width: '100%' }} onClick={() => navigate('/admin')}>
                                    Return to Dashboard
                                </Button>
                            </GlassCard>
                        </motion.div>
                    )}
                </motion.div>
            </main>
        </div>
    );
};
