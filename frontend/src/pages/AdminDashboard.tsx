import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Plus, Users, FileText, DollarSign, TrendingUp, Download, Key, Link as LinkIcon, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const data = [
    { name: 'Mon', revenue: 4000, students: 240 },
    { name: 'Tue', revenue: 3000, students: 139 },
    { name: 'Wed', revenue: 5000, students: 380 },
    { name: 'Thu', revenue: 2780, students: 190 },
    { name: 'Fri', revenue: 6890, students: 430 },
    { name: 'Sat', revenue: 2390, students: 120 },
    { name: 'Sun', revenue: 3490, students: 210 },
];

const mockResults = [
    { id: 1, student: 'Alice Smith', exam: 'Advanced React Patterns', score: 48, total: 50, status: 'Completed', remarks: 'Clean' },
    { id: 2, student: 'Bob Jones', exam: 'System Design Basics', score: 95, total: 100, status: 'Completed', remarks: '1 Warning: Looking Away' },
    { id: 3, student: 'Charlie Brown', exam: 'JavaScript Fundamentals', score: 12, total: 40, status: 'Terminated', remarks: '3 Warnings: Audio Spikes' },
    { id: 4, student: 'Dave White', exam: 'System Design Basics', score: 88, total: 100, status: 'Completed', remarks: 'Clean' },
];

const mockExamsInventory = [
    { title: 'Advanced React Patterns', code: 'REACT-2026', schedule: '2026-03-01 10:00', students: 124 },
    { title: 'System Design Basics', code: 'SYS-DES-101', schedule: '2026-03-02 14:30', students: 89 },
    { title: 'Theoretical Physics Unit 1', code: 'PHYS-402', schedule: '2026-03-05 09:00', students: 0 },
];

const StatCard = ({ title, value, icon, trend }: any) => (
    <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>{title}</p>
                <h3 style={{ fontSize: '1.75rem', marginTop: 4 }}>{value}</h3>
            </div>
            <div style={{ padding: 12, borderRadius: 12, background: 'var(--color-surface)', color: 'var(--color-primary)' }}>
                {icon}
            </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--color-success)', fontWeight: 500 }}>
            <TrendingUp size={14} /> {trend} vs last week
        </div>
    </GlassCard>
);

export const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user && user.role !== 'ADMIN') {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const downloadPDF = async () => {
        const input = document.getElementById('pdf-report');
        if (!input) return;

        // Temporarily adjust styles for a clean PDF white-background look
        const originalBackground = input.style.background;
        input.style.background = '#ffffff';
        input.style.color = '#000000'; // Ensure text is dark

        try {
            const canvas = await html2canvas(input, { scale: 2, backgroundColor: '#ffffff' });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('Admin_Student_Report.pdf');
        } catch (error) {
            console.error("PDF generation failed", error);
        } finally {
            // Restore original styles
            input.style.background = originalBackground;
            input.style.color = '';
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <main style={{ flex: 1, padding: 'var(--space-4)' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                        <div>
                            <h1 style={{ fontSize: '2rem' }}>Admin Dashboard</h1>
                            <p style={{ color: 'var(--color-text-muted)' }}>Overview of your examination platform.</p>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                            <Button variant="outline" onClick={downloadPDF}>
                                <Download size={18} /> Export PDF Report
                            </Button>
                            <Button variant="primary" onClick={() => navigate('/admin/create')}>
                                <Plus size={18} /> Create New Exam
                            </Button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}
                    >
                        <StatCard title="Total Students" value="1,248" icon={<Users size={24} />} trend="+12.5%" />
                        <StatCard title="Active Exams" value="24" icon={<FileText size={24} />} trend="+4.1%" />
                        <StatCard title="Total Revenue" value="$12,450" icon={<DollarSign size={24} />} trend="+28.4%" />
                    </motion.div>

                    {/* Charts Area */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                        style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-4)' }}
                    >
                        <GlassCard style={{ height: 400, display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ marginBottom: 'var(--space-4)' }}>Revenue & Activity Overview</h3>
                            <div style={{ flex: 1, width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                                        <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                        <Tooltip
                                            contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, color: 'var(--color-text)' }}
                                        />
                                        <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </GlassCard>

                        <section style={{ marginTop: 'var(--space-4)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                                <h3 style={{ fontSize: '1.25rem' }}>Exam Inventory & Unique Codes</h3>
                                <div style={{ fontSize: 13, background: 'rgba(79, 70, 229, 0.1)', color: 'var(--color-primary)', padding: '4px 12px', borderRadius: 20, fontWeight: 600 }}>
                                    Active Repository
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-3)' }}>
                                {mockExamsInventory.map((exam, i) => (
                                    <GlassCard key={i} style={{ borderLeft: '4px solid var(--color-primary)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                                            <h4 style={{ margin: 0 }}>{exam.title}</h4>
                                            <div style={{ background: 'var(--color-surface)', padding: '4px 8px', borderRadius: 6, fontSize: 13, fontWeight: 'bold', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <Key size={14} /> {exam.code}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--color-text-muted)' }}>
                                            <span>Starts: {exam.schedule}</span>
                                            <span>{exam.students} Students</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: 8, marginTop: 'var(--space-3)' }}>
                                            <Button size="sm" variant="ghost" style={{ flex: 1, fontSize: 12 }} onClick={() => {
                                                navigator.clipboard.writeText(exam.code);
                                                alert("Code copied to clipboard!");
                                            }}>
                                                <Copy size={14} /> Copy Code
                                            </Button>
                                            <Button size="sm" variant="ghost" style={{ flex: 1, fontSize: 12 }}>
                                                <LinkIcon size={14} /> Invite Link
                                            </Button>
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>
                        </section>

                        {/* PDF Target Area: Student Results Table */}
                        <div id="pdf-report" style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', background: 'var(--color-surface)', marginTop: 'var(--space-4)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }}>Integrity & Performance Report</h3>
                                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Generated: {new Date().toLocaleDateString()}</div>
                            </div>

                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                                        <th style={{ padding: 'var(--space-2)', fontWeight: 600 }}>Student</th>
                                        <th style={{ padding: 'var(--space-2)', fontWeight: 600 }}>Exam</th>
                                        <th style={{ padding: 'var(--space-2)', fontWeight: 600 }}>Score</th>
                                        <th style={{ padding: 'var(--space-2)', fontWeight: 600 }}>Status</th>
                                        <th style={{ padding: 'var(--space-2)', fontWeight: 600 }}>Proctor Remarks (AI)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockResults.map((result) => (
                                        <tr key={result.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                            <td style={{ padding: 'var(--space-2)' }}>{result.student}</td>
                                            <td style={{ padding: 'var(--space-2)' }}>{result.exam}</td>
                                            <td style={{ padding: 'var(--space-2)' }}>
                                                <span style={{ fontWeight: 'bold' }}>{result.score}</span> / {result.total}
                                            </td>
                                            <td style={{ padding: 'var(--space-2)' }}>
                                                <span style={{
                                                    padding: '4px 8px', borderRadius: 4, fontSize: 12, fontWeight: 'bold',
                                                    background: result.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                    color: result.status === 'Completed' ? '#10b981' : '#ef4444'
                                                }}>
                                                    {result.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: 'var(--space-2)', color: result.remarks === 'Clean' ? 'var(--color-success)' : 'var(--color-danger)', fontSize: 14 }}>
                                                {result.remarks}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                </div>
            </main>
        </div>
    );
};
