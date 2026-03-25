import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, BarChart3, Atom, Network, Cpu, Database, GraduationCap, Heart, Eye, Menu, X, Zap, PanelLeft, LayoutDashboard, PanelRight, Layers, Map, Gamepad2, Printer, FileSpreadsheet, BookOpen, FileText, Trello, Columns, MonitorCheck } from 'lucide-react';

const NAV_ITEMS = [
    { path: '/', label: 'Home', icon: Brain, section: null },
    { path: '/poster-left', label: 'Background & Methods', icon: PanelLeft, section: 'Poster Board' },
    { path: '/poster-center', label: 'Results & Data', icon: LayoutDashboard, section: 'Poster Board' },
    { path: '/poster-model', label: 'Model Deep Dive', icon: Layers, section: 'Poster Board' },
    { path: '/poster-right', label: 'Analysis & Impact', icon: PanelRight, section: 'Poster Board' },
    { path: '/complete-poster', label: 'Complete Poster', icon: Printer, section: 'Poster Board' },
    { path: '/user-journey', label: 'User Journey', icon: Map, section: 'App Guide' },
    { path: '/app-features', label: 'App Features', icon: Gamepad2, section: 'App Guide' },
    { path: '/model-explanation', label: 'Model Explanation', icon: Brain, section: 'App Guide' },

    // Academic / Print Section
    { path: '/data-tables', label: 'Data Tables (Raw)', icon: FileSpreadsheet, section: 'Academic / Print' },
    { path: '/academic-app-features', label: 'App Specifications', icon: FileText, section: 'Academic / Print' },
    { path: '/academic-model-explanation', label: 'Model Circuit', icon: Layers, section: 'Academic / Print' },
    { path: '/academic-architecture', label: 'System Topology', icon: Network, section: 'Academic / Print' },
    { path: '/academic-evaluation', label: 'Full Evaluation Report', icon: BookOpen, section: 'Academic / Print' },
    { path: '/academic-model-deep-dive', label: 'VQC Math & Code', icon: Cpu, section: 'Academic / Print' },

    // Poster Section
    { path: '/academic-poster-left', label: 'Poster: Intro & Methods', icon: PanelLeft, section: 'Poster Series' },
    { path: '/academic-poster-center', label: 'Poster: Results', icon: LayoutDashboard, section: 'Poster Series' },
    { path: '/academic-poster-right', label: 'Poster: Conclusion', icon: PanelRight, section: 'Poster Series' },
    { path: '/academic-complete-poster', label: 'Complete Poster (3-Panel)', icon: Columns, section: 'Poster Series' },

    { path: '/comprehensive-analysis', label: 'Comprehensive Analysis', icon: BarChart3, section: 'Deep Dive' },
    { path: '/evaluation', label: 'Model Evaluation (Color)', icon: BarChart3, section: 'Deep Dive' },
    { path: '/quantum', label: 'Quantum Fundamentals', icon: Atom, section: 'Quantum' },
    { path: '/vqc', label: 'VQC Deep Dive', icon: Cpu, section: 'Quantum' },
    { path: '/architecture', label: 'System Architecture', icon: Network, section: 'System' },
    { path: '/data-pipeline', label: 'Data Pipeline', icon: Database, section: 'System' },
    { path: '/training', label: 'Training Process', icon: Zap, section: 'System' },
    { path: '/impact', label: 'Student Impact', icon: Heart, section: 'Vision' },
    { path: '/vision', label: 'The Bigger Picture', icon: Eye, section: 'Vision' },
];

export default function Layout({ children }) {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const grouped = {};
    NAV_ITEMS.forEach(item => {
        const section = item.section || '_top';
        if (!grouped[section]) grouped[section] = [];
        grouped[section].push(item);
    });

    const renderNav = () => (
        <nav className="space-y-6">
            {Object.entries(grouped).map(([section, items]) => (
                <div key={section}>
                    {section !== '_top' && (
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-3">
                            {section}
                        </div>
                    )}
                    <div className="space-y-1">
                        {items.map(item => {
                            const Icon = item.icon;
                            const active = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${active
                                        ? 'bg-qm-600 text-white shadow-md shadow-qm-600/30'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                        }`}
                                >
                                    <Icon className="w-4 h-4 flex-shrink-0" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}
        </nav>
    );

    return (
        <div className="min-h-screen flex">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 bg-white fixed h-screen overflow-y-auto">
                <div className="p-6 border-b border-slate-100">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-qm-500 to-qm-700 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-qm-500/30">
                            QM
                        </div>
                        <div>
                            <div className="font-bold text-slate-900 text-sm">Quantum Mind</div>
                            <div className="text-xs text-slate-500">Workshop Documentation</div>
                        </div>
                    </Link>
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                    {renderNav()}
                </div>
                <div className="p-4 border-t border-slate-100 text-xs text-slate-400 text-center">
                    Science Fair Project 2026
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-200">
                <div className="flex items-center justify-between px-4 py-3">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-qm-500 to-qm-700 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                            QM
                        </div>
                        <span className="font-bold text-sm text-slate-900">Quantum Mind</span>
                    </Link>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-600">
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
                {sidebarOpen && (
                    <div className="bg-white border-t border-slate-100 p-4 max-h-[70vh] overflow-y-auto shadow-xl">
                        {renderNav()}
                    </div>
                )}
            </div>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64">
                <div className="pt-16 lg:pt-0 min-h-screen">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
