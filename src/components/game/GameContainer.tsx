import { useGameStore } from '../../store/useGameStore';
import StartScreen from './StartScreen';
import NarrativeScene from './NarrativeScene';
import QuestionScene from './QuestionScene';
import ResultScreen from './ResultScreen';
import { AnimatePresence, motion } from 'framer-motion';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';

export default function GameContainer() {
    const { playerName, currentIndex, currentPhase, isGameOver, getCurrentScene } = useGameStore();
    const currentScene = getCurrentScene();

    // Lock body scroll for fullscreen experience
    useLockBodyScroll();

    return (
        <div className="fixed inset-0 z-50 w-screen h-[100dvh] overflow-hidden bg-black touch-action-none flex justify-center items-center">
            {/* Mobile Frame Container */}
            <div className="w-full h-full max-w-[450px] relative bg-nostalgia-50 shadow-2xl overflow-hidden flex justify-center items-center">
                {!playerName ? (
                    <StartScreen />
                ) : isGameOver ? (
                    <ResultScreen />
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${currentPhase}-${currentIndex}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="w-full h-full flex flex-col"
                        >
                            {currentScene?.type === 'narrative' && <NarrativeScene />}
                            {currentScene?.type === 'question' && <QuestionScene />}
                            {currentScene?.type === 'pivot' && <QuestionScene />}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
