import { useGameStore } from '../../store/useGameStore';
import { motion } from 'framer-motion';
import { RotateCw } from 'lucide-react';
import resultBg from '../../assets/results/result.png';

// Import all result images for logos
import allIn from '../../assets/results/all_in.png';
import almost from '../../assets/results/almost.png';
import beforeIKnew from '../../assets/results/before_i_knew.png';
import goldenChapter from '../../assets/results/golden_chapter.png';
import justUs from '../../assets/results/just_us.png';
import onceAndAlways from '../../assets/results/once_and_always.png';
import quietly from '../../assets/results/quietly.png';
import softPlace from '../../assets/results/soft_place.png';

const logoMap: Record<string, string> = {
    'All In': allIn,
    'Almost': almost,
    'Before I Knew': beforeIKnew,
    'Golden Chapter': goldenChapter,
    'Just Us': justUs,
    'Once & Always': onceAndAlways,
    'Quietly': quietly,
    'Soft Place': softPlace,
};

export default function ResultScreen() {
    const { calculateResult, resetGame, playerName } = useGameStore();
    const result = calculateResult();
    const logoSrc = logoMap[result.archetype] || goldenChapter;

    return (
        <div className="fixed inset-0 z-50 w-full h-[100dvh] bg-black flex flex-col items-center justify-center overflow-hidden">
            {/* Background Image Container - Centered Mobile Frame */}
            <div className="relative w-full h-full max-w-[450px] bg-cover bg-center shadow-2xl"
                style={{ backgroundImage: `url(${resultBg})` }}>

                {/* Paper Content Area - Fixed Centered, No Scroll */}
                <div className="absolute inset-x-0 top-0 bottom-[15%] px-[12%] flex flex-col items-center justify-center text-center overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="w-full flex flex-col items-center"
                    >
                        {/* 1. Header */}
                        <h3 className="text-slate-500 uppercase tracking-widest text-[10px] font-bold mb-3 font-kanit">
                            {playerName}'s Result
                        </h3>

                        {/* 2. Logo & Archetype Title */}
                        <div className="flex flex-col items-center gap-2 mb-2">
                            <img
                                src={logoSrc}
                                alt={result.archetypeTitle}
                                className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-md"
                            />
                            <h1 className="text-xl md:text-2xl font-bold text-slate-800 font-kanit leading-tight mt-1">
                                {result.archetypeTitle}
                            </h1>
                        </div>

                        {/* 3. MBTI */}
                        <p className="text-xs md:text-sm font-bold text-slate-500 mb-3 font-kanit tracking-wide">
                            {result.mbti}
                        </p>

                        {/* 4. The Quote */}
                        <p className="text-slate-600 italic mb-5 text-xs md:text-sm font-medium font-kanit px-4 leading-relaxed line-clamp-2">
                            "{result.archetypeQuote}"
                        </p>

                        {/* 5. Description - Fixed text, no scroll box */}
                        <div className="w-full text-center mt-2 px-1">
                            <p className="text-slate-800 leading-relaxed text-[11px] md:text-sm font-kanit whitespace-pre-wrap line-clamp-[8] md:line-clamp-none">
                                {result.archetypeDescription}
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Footer Actions - Fixed at bottom of the frame */}
                <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20">
                    <button
                        onClick={resetGame}
                        className="px-8 py-3 bg-slate-800 text-white rounded-full font-bold text-sm shadow-lg active:scale-95 transition-transform flex items-center gap-2 font-kanit border-2 border-white/20"
                    >
                        <RotateCw className="w-4 h-4" />
                        Play Again
                    </button>
                </div>
            </div>
        </div>
    );
}
