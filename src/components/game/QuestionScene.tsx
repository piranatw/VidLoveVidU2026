import { useGameStore } from '../../store/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { getBackgroundImage } from '../../utils/backgroundLoader';
import { useState, useEffect } from 'react';

export default function QuestionScene() {
    const { getCurrentScene, answerQuestion, currentIndex, currentPhase } = useGameStore();
    const scene = getCurrentScene();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isContentVisible, setIsContentVisible] = useState(false);
    const [canInteract, setCanInteract] = useState(false);

    // Reset lock when scene changes
    useEffect(() => {
        setIsTransitioning(false);
        setCanInteract(false);
        setIsContentVisible(false); // Reset visibility for clean re-entry
    }, [currentIndex]);

    if (!scene || !scene.choices) return null;

    const handleChoice = (traits: Record<string, number>) => {
        if (isTransitioning || !canInteract) return;

        setIsTransitioning(true);
        // Wait for exit animation to finish
        setTimeout(() => {
            answerQuestion(traits);
            // isTransitioning remains true until component unmounts or currentIndex triggers useEffect
        }, 300);
    };

    const handleReveal = () => {
        if (!isContentVisible) {
            setIsContentVisible(true);
        }
    };

    // Filter choices
    const positionedChoices = scene.choices.filter(c => c.position);
    const stackedChoices = scene.choices.filter(c => !c.position);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        },
        exit: { opacity: 0 }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div
            className={`w-full h-full relative overflow-hidden flex flex-col items-center justify-center cursor-pointer ${isTransitioning ? 'pointer-events-none' : ''}`}
            onClick={handleReveal}
        >
            {/* Main Background with feathered edges (Matching NarrativeScene) */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
                style={{
                    backgroundImage: `url(${getBackgroundImage(scene.background)})`,
                    backgroundColor: '#f0f0f0',
                }}
            />

            {/* Edge Blur Overlay */}
            <div
                className="absolute inset-0 z-0 pointer-events-none backdrop-blur-sm"
                style={{
                    WebkitMaskImage: 'radial-gradient(circle at center, transparent 60%, black 100%)',
                    maskImage: 'radial-gradient(circle at center, transparent 60%, black 100%)'
                }}
            />

            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 z-0 pointer-events-none" />

            <AnimatePresence mode="wait">
                {isContentVisible && (
                    <motion.div
                        key={`${currentPhase}-${currentIndex}-content`}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={containerVariants}
                        className="absolute inset-0 z-10 flex flex-col items-center"
                    >
                        {/* Question Bubble */}
                        <div className="mt-[2vh] w-full px-6 flex justify-center pointer-events-none">
                            <motion.div
                                variants={itemVariants}
                                className="px-2 py-4 flex items-center justify-center text-center"
                                style={{
                                    background: 'white',
                                    borderRadius: '20px',
                                    border: '1px solid #ccc',
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <h2 className="text-xl md:text-2xl text-nostalgia-900 font-medium leading-relaxed font-serif whitespace-pre-wrap px-8">
                                    {scene.text}
                                </h2>
                            </motion.div>
                        </div>

                        {/* Interactive Container for Choices */}
                        <div className={`w-full h-full absolute inset-0 ${!canInteract ? 'pointer-events-none' : ''}`}>
                            {/* Positioned Choices (Absolute) */}
                            {positionedChoices.map((choice, idx) => (
                                <motion.button
                                    key={`pos-${idx}`}
                                    variants={itemVariants}
                                    onAnimationComplete={() => {
                                        // On the last item, unlock interaction
                                        if (idx === positionedChoices.length - 1 && stackedChoices.length === 0) {
                                            setCanInteract(true);
                                        }
                                    }}
                                    disabled={!canInteract || isTransitioning}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleChoice(choice.traits);
                                    }}
                                    className={`absolute px-6 py-3 rounded-xl bg-white/80 backdrop-blur-md border border-white/50 text-nostalgia-900 font-medium shadow-lg transition-transform ${canInteract && !isTransitioning ? 'active:scale-95' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
                                    style={{
                                        top: choice.position?.top,
                                        left: choice.position?.left,
                                        right: choice.position?.right,
                                        bottom: choice.position?.bottom,
                                        transform: 'translate(-50%, -50%)' // Center anchor
                                    }}
                                >
                                    {choice.text}
                                </motion.button>
                            ))}

                            {/* Stacked Choices (Bottom) */}
                            {stackedChoices.length > 0 && (
                                <div className="absolute bottom-10 w-full max-w-md px-6 flex flex-col gap-3 pb-safe pointer-events-auto items-center left-0 right-0 mx-auto">
                                    {stackedChoices.map((choice, idx) => (
                                        <motion.button
                                            key={`stack-${idx}`}
                                            variants={itemVariants}
                                            onAnimationComplete={() => {
                                                // On the last item, unlock interaction
                                                if (idx === stackedChoices.length - 1) {
                                                    setCanInteract(true);
                                                }
                                            }}
                                            disabled={!canInteract || isTransitioning}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleChoice(choice.traits);
                                            }}
                                            className={`w-full py-4 px-6 rounded-2xl text-left text-nostalgia-900 font-medium text-lg border border-white/60 shadow-sm backdrop-blur-sm bg-white/60 transition-colors ${canInteract && !isTransitioning ? 'active:bg-retro-pink/20 active:scale-97' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            {choice.text}
                                        </motion.button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tap to Reveal Hint - Only show when waiting for first click */}
            {!isContentVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    exit={{ opacity: 0 }}
                    className="absolute bottom-20 text-nostalgia-600 text-sm font-bold tracking-widest uppercase pointer-events-none"
                >
                    Tap to Reveal
                </motion.div>
            )}
        </div>
    );
}
