import { Printer, Download } from 'lucide-react';
import PosterLeft from './PosterLeft';
import PosterCenter from './PosterCenter';
import PosterRight from './PosterRight';

export default function CompletePoster() {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div>
            {/* Print Controls - Hidden when printing */}
            <div className="print:hidden mb-8 bg-white rounded-xl border border-slate-200 p-6 shadow-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Complete Science Fair Poster</h2>
                        <p className="text-slate-600 text-sm">
                            Three-panel trifold board view. Click print to export or save as PDF.
                        </p>
                    </div>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-6 py-3 bg-qm-600 text-white rounded-lg font-semibold hover:bg-qm-700 transition-colors shadow-lg"
                    >
                        <Printer className="w-5 h-5" />
                        Print / Export PDF
                    </button>
                </div>

                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-bold text-blue-900 text-sm mb-2">Printing Tips</h3>
                    <ul className="text-xs text-blue-800 space-y-1">
                        <li>• Set orientation to <strong>Landscape</strong> for best results</li>
                        <li>• Use <strong>Save as PDF</strong> in print dialog to export</li>
                        <li>• Recommended paper size: <strong>11×17" (Tabloid)</strong> or <strong>A3</strong></li>
                        <li>• For physical tri-fold board: print each panel separately on 8.5×11" or A4</li>
                    </ul>
                </div>
            </div>

            {/* Three-Panel Layout */}
            <div className="poster-container">
                {/* Desktop: Side-by-side panels */}
                <div className="hidden xl:grid xl:grid-cols-3 gap-6 print:grid print:grid-cols-3 print:gap-4">
                    {/* Left Panel */}
                    <div className="bg-white rounded-xl border-2 border-slate-300 p-6 shadow-xl print:shadow-none print:border print:border-slate-400">
                        <div className="text-center mb-6 pb-4 border-b-2 border-qm-500">
                            <h2 className="text-xl font-black text-qm-700 uppercase tracking-wide">Left Panel</h2>
                            <p className="text-xs text-slate-600 mt-1">Background & Methods</p>
                        </div>
                        <div className="scale-[0.85] origin-top">
                            <PosterLeft />
                        </div>
                    </div>

                    {/* Center Panel */}
                    <div className="bg-white rounded-xl border-2 border-slate-300 p-6 shadow-xl print:shadow-none print:border print:border-slate-400">
                        <div className="text-center mb-6 pb-4 border-b-2 border-qm-600">
                            <h2 className="text-xl font-black text-qm-800 uppercase tracking-wide">Center Panel</h2>
                            <p className="text-xs text-slate-600 mt-1">Results & Data</p>
                        </div>
                        <div className="scale-[0.85] origin-top">
                            <PosterCenter />
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="bg-white rounded-xl border-2 border-slate-300 p-6 shadow-xl print:shadow-none print:border print:border-slate-400">
                        <div className="text-center mb-6 pb-4 border-b-2 border-qm-700">
                            <h2 className="text-xl font-black text-qm-900 uppercase tracking-wide">Right Panel</h2>
                            <p className="text-xs text-slate-600 mt-1">Analysis & Impact</p>
                        </div>
                        <div className="scale-[0.85] origin-top">
                            <PosterRight />
                        </div>
                    </div>
                </div>

                {/* Mobile/Tablet: Stacked panels */}
                <div className="xl:hidden space-y-8 print:hidden">
                    <div className="bg-white rounded-xl border-2 border-slate-300 p-6 shadow-xl">
                        <div className="text-center mb-6 pb-4 border-b-2 border-qm-500">
                            <h2 className="text-2xl font-black text-qm-700 uppercase tracking-wide">Left Panel</h2>
                            <p className="text-sm text-slate-600 mt-2">Background & Methods</p>
                        </div>
                        <PosterLeft />
                    </div>

                    <div className="bg-white rounded-xl border-2 border-slate-300 p-6 shadow-xl">
                        <div className="text-center mb-6 pb-4 border-b-2 border-qm-600">
                            <h2 className="text-2xl font-black text-qm-800 uppercase tracking-wide">Center Panel</h2>
                            <p className="text-sm text-slate-600 mt-2">Results & Data</p>
                        </div>
                        <PosterCenter />
                    </div>

                    <div className="bg-white rounded-xl border-2 border-slate-300 p-6 shadow-xl">
                        <div className="text-center mb-6 pb-4 border-b-2 border-qm-700">
                            <h2 className="text-2xl font-black text-qm-900 uppercase tracking-wide">Right Panel</h2>
                            <p className="text-sm text-slate-600 mt-2">Analysis & Impact</p>
                        </div>
                        <PosterRight />
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx>{`
                @media print {
                    @page {
                        size: landscape;
                        margin: 0.5in;
                    }
                    
                    body {
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                    
                    .poster-container {
                        page-break-inside: avoid;
                    }
                }
            `}</style>
        </div>
    );
}
