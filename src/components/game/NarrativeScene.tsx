import { useGameStore } from '../../store/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { getBackgroundImage } from '../../utils/backgroundLoader';

export default function NarrativeScene() {
    const { getCurrentScene, nextDialogue, currentPhase, currentIndex, textIndex } = useGameStore();
    const scene = getCurrentScene();

    // Reset text index when scene changes
    useEffect(() => {
        // This effect intentionally left minimal - textIndex reset is handled in nextScene()
    }, [currentPhase, currentIndex]);

    if (!scene || scene.type !== 'narrative') return null;

    const dialogue = scene.dialogue || [];
    const hasDialogue = dialogue.length > 0;
    const isTextVisible = textIndex >= 0;
    const currentText = isTextVisible && textIndex < dialogue.length ? dialogue[textIndex] : null;

    // Empty dialogue array = visual only scene
    const isVisualOnly = !hasDialogue;

    const handleClick = () => {
        nextDialogue();
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={`${currentPhase}-${currentIndex}-bg`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full h-full cursor-pointer flex flex-col items-center justify-center bg-cover bg-center"
                style={{
                    backgroundImage: `url(${getBackgroundImage(scene.background)})`,
                    backgroundColor: '#f0f0f0'
                }}
                onClick={handleClick}
            >
                {/* Overlay Gradient/Blur */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white/90 z-0 pointer-events-none" />

                {/* Text Content */}
                <div className="relative z-10 w-full px-8 flex flex-col items-center">
                    <AnimatePresence mode="wait">
                        {currentText && (
                            <motion.div
                                key={`${currentPhase}-${currentIndex}-${textIndex}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4 }}
                                className="p-16 rounded-full flex items-center justify-center text-center"
                                style={{
                                    backgroundImage: `url(${getBackgroundImage('text-bubble')})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    minHeight: '200px',
                                    width: '100%',
                                    maxWidth: '400px',
                                    aspectRatio: '1/1'
                                }}
                            >
                                <p className="text-md md:text-lg text-nostalgia-900 font-medium leading-relaxed font-serif whitespace-pre-wrap">
                                    {currentText}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Tap Indicators */}
                    {!isTextVisible && hasDialogue && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.7 }}
                            className="fixed bottom-20 pb-[env(safe-area-inset-bottom)] text-nostalgia-600 text-sm font-bold tracking-widest uppercase"
                        >
                            Tap to Reveal
                        </motion.div>
                    )}

                    {(isTextVisible || isVisualOnly) && (
                        <motion.div
                            animate={{ y: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="fixed bottom-20 pb-[env(safe-area-inset-bottom)] text-nostalgia-600 text-sm font-bold tracking-widest uppercase opacity-70"
                        >
                            Tap to Continue
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
