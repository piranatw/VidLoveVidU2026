import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/useGameStore';
import { motion } from 'framer-motion';
import { Star, ChevronLeft } from 'lucide-react';
import startBg from '../../assets/backgrounds/start.png';
import logoImg from '../../assets/backgrounds/logo.png';

export default function StartScreen() {
    const navigate = useNavigate();
    const { setPlayerName, startGame } = useGameStore();
    const [name, setName] = useState('');

    const handleStart = () => {
        if (!name.trim()) return;
        setPlayerName(name);
        startGame();
    };

    return (
        <div className="flex flex-col items-center w-full h-full relative overflow-hidden animate-in fade-in duration-700">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{ backgroundImage: `url(${startBg})` }}
            />


            {/* Scrollable Content Container */}
            <div className="relative z-10 w-full h-full overflow-y-auto no-scrollbar flex flex-col items-center py-8 px-6 justify-center">

                {/* ID Card Wrapper */}
                <div className="relative w-full max-w-[380px] bg-white rounded-3xl shadow-2xl flex flex-col items-center overflow-hidden pt-10 pb-0 border border-black/5 shrink-0">

                    {/* Top Clip (Red) */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-10 bg-[#D32F2F] rounded-b-xl z-20 shadow-md" />

                    {/* Card Content Area (Gradient + Texture) */}
                    <div className="relative w-full h-full flex flex-col items-center px-6 pt-6 pb-0 bg-gradient-to-b from-white via-[#EBF4FF] to-[#D9E8F5]">

                        {/* Header Section */}
                        <div className="w-full flex justify-between items-start mb-8">
                            {/* Logo Circle */}
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-[#E5E5E5] relative overflow-hidden shadow-inner shrink-0">
                                <img
                                    src={logoImg}
                                    alt="VLVU Logo"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* ID Type + Stars */}
                            <div className="text-right pt-2 md:pt-4">
                                <h2 className="text-[10px] md:text-[12px] font-black text-slate-800 tracking-wider">STUDENT ID CARD</h2>
                                <h3 className="text-[12px] md:text-[14px] font-black text-slate-800 leading-tight">VID LOVE VID U SCHOOL</h3>
                                <div className="flex justify-end gap-1 mt-1 md:mt-2">
                                    {[1, 2, 3].map((s) => (
                                        <Star key={s} className="w-5 h-5 md:w-7 md:h-7 fill-[#A2A4D1] text-[#A2A4D1]" />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Name Input Section */}
                        <div className="w-full text-center space-y-1 mb-8 relative z-10">
                            <label className="text-[10px] md:text-sm font-bold text-slate-800 uppercase tracking-[0.2em]">NAME</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full py-2 md:py-3 px-6 rounded-full border-2 border-slate-300 bg-white text-center text-base md:text-lg font-bold text-slate-800 shadow-inner focus:outline-none focus:border-retro-blue/50 transition-colors"
                            />
                        </div>

                        {/* Student Info + Background Graphics */}
                        <div className="w-full relative min-h-[120px] md:min-h-[140px] px-2 mb-2">
                            <div className="absolute left-[-10px] bottom-[-10px] w-32 h-32 md:w-48 md:h-48 opacity-30 pointer-events-none">
                                <svg viewBox="0 0 200 200" className="w-full h-full text-[#FDE68A] fill-current">
                                    <path d="M100 0L115 70L190 60L130 110L170 185L100 145L30 185L70 110L10 60L85 70L100 0Z" />
                                </svg>
                            </div>

                            <div className="relative z-10 space-y-0.5">
                                <p className="text-[12px] md:text-[14px] font-black text-slate-800">HIGH SCHOOL STUDENT</p>
                                <p className="text-[12px] md:text-[14px] font-black text-slate-800">ID : 13 02 2569</p>
                                <p className="text-[12px] md:text-[14px] font-black text-slate-800">CLASS : 6/9</p>
                            </div>

                            <div className="absolute bottom-1 right-2 flex flex-col items-center scale-90 md:scale-100 origin-bottom-right">
                                <div className="text-retro-pink font-black text-xl md:text-2xl italic tracking-tighter drop-shadow-sm flex items-center gap-1">
                                    VLVU <span className="text-slate-800 relative">69 <span className="absolute -top-1 -right-1 text-xs">❤</span></span>
                                </div>
                                <p className="text-[8px] md:text-[10px] font-black text-slate-800 mt-0.5">VLVU 69 (PRINCIPAL)</p>
                            </div>
                        </div>

                        {/* Blue Bottom Bar */}
                        <div className="w-[120%] -mx-[10%] bg-[#9BC4E2] py-2 flex items-center justify-center border-t border-black/10">
                            <span className="text-[10px] md:text-[12px] font-black text-slate-800 tracking-wider">A LITTLE THING CALLED VID LOVE</span>
                        </div>
                    </div>
                </div>

                {/* Start Button (Outside Card) */}
                <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    onClick={handleStart}
                    disabled={!name.trim()}
                    className="mt-8 mb-4 py-4 px-12 md:px-16 bg-[#FCE68A] text-slate-800 rounded-2xl font-black text-lg md:text-xl shadow-lg hover:bg-[#FDE68A]/90 active:scale-95 disabled:opacity-50 disabled:grayscale transition-all relative z-20 shrink-0"
                >
                    เริ่มทำแบบทดสอบ
                </motion.button>

                {/* Back Button below Start */}
                <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    onClick={() => navigate('/')}
                    className="py-2 px-8 text-slate-600 font-bold text-base hover:text-slate-800 transition-colors relative z-20 shrink-0 flex items-center gap-1"
                >
                    <ChevronLeft className="w-5 h-5" />
                    ย้อนกลับ
                </motion.button>
            </div>
        </div>
    );
}
