import { Printer } from 'lucide-react';
import AcademicPosterLeft from './AcademicPosterLeft';
import AcademicPosterCenter from './AcademicPosterCenter';
import AcademicPosterRight from './AcademicPosterRight';

export default function AcademicCompletePoster() {
    return (
        <div className="w-full min-w-[1200px] overflow-x-auto pb-12">
            {/* Controls */}
            <div className="flex justify-between items-center mb-8 px-8 print:hidden">
                <div>
                    <h1 className="text-2xl font-bold font-serif">Academic Poster View (Full)</h1>
                    <p className="text-gray-600">Complete 3-panel layout. Use landscape mode for printing.</p>
                </div>
                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-6 py-2 bg-black text-white hover:bg-gray-800 transition-colors uppercase font-bold tracking-widest text-sm"
                >
                    <Printer className="w-5 h-5" />
                    Print Poster
                </button>
            </div>

            {/* Poster Layout */}
            <div className="flex flex-row gap-0 bg-white min-h-screen border-t-8 border-b-8 border-black">
                {/* Left Panel - 30% */}
                <div className="w-[30%] border-r-2 border-dashed border-gray-400">
                    <AcademicPosterLeft />
                </div>

                {/* Center Panel - 40% */}
                <div className="w-[40%] border-r-2 border-dashed border-gray-400 bg-gray-50/30">
                    <AcademicPosterCenter />
                </div>

                {/* Right Panel - 30% */}
                <div className="w-[30%]">
                    <AcademicPosterRight />
                </div>
            </div>
        </div>
    );
}
