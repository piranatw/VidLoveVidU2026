import { create } from 'zustand';
import type { GameResult, GameScene } from '../types';
import { GLOBAL_SCENES, ROOM1_SCENES, ROOM2_SCENES } from '../data/scenes';

interface GameState {
    playerName: string;
    currentIndex: number;
    currentPhase: 'global' | 'room1' | 'room2';
    textIndex: number; // -1 = not revealed, 0+ = current dialogue index
    scores: {
        E: number; I: number; S: number; N: number;
        T: number; F: number; J: number; P: number;
    };
    isGameOver: boolean;

    setPlayerName: (name: string) => void;
    startGame: () => void;
    answerQuestion: (traits: { [key: string]: number }) => void;
    nextDialogue: () => void; // Advance within scene dialogue or to next scene
    nextScene: () => void;
    resetGame: () => void;
    getCurrentScene: () => GameScene | undefined;
    calculateResult: () => GameResult;
}

const initialScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

export const useGameStore = create<GameState>((set, get) => ({
    playerName: '',
    currentIndex: 0,
    currentPhase: 'global',
    textIndex: -1, // Start with text not revealed
    scores: initialScores,
    isGameOver: false,

    setPlayerName: (name) => set({ playerName: name }),

    startGame: () => {
        set({
            currentIndex: 0,
            currentPhase: 'global',
            textIndex: -1,
            scores: initialScores,
            isGameOver: false
        });
    },

    getCurrentScene: () => {
        const { currentIndex, currentPhase } = get();
        if (currentPhase === 'global') return GLOBAL_SCENES[currentIndex];
        if (currentPhase === 'room1') return ROOM1_SCENES[currentIndex];
        if (currentPhase === 'room2') return ROOM2_SCENES[currentIndex];
        return undefined;
    },

    answerQuestion: (traits) => {
        set((state) => {
            const newScores = { ...state.scores };
            Object.entries(traits).forEach(([key, value]) => {
                // @ts-ignore
                if (key in newScores) newScores[key as keyof typeof newScores] += value;
            });
            return { scores: newScores };
        });
        get().nextScene();
    },

    nextDialogue: () => {
        const scene = get().getCurrentScene();
        const { textIndex } = get();

        // If scene has dialogue array
        if (scene?.dialogue && scene.dialogue.length > 0) {
            // If not yet revealed, show first dialogue
            if (textIndex === -1) {
                set({ textIndex: 0 });
                return;
            }
            // If more dialogue lines exist, advance
            if (textIndex < scene.dialogue.length - 1) {
                set({ textIndex: textIndex + 1 });
                return;
            }
        }

        // Otherwise, advance to next scene
        get().nextScene();
    },

    nextScene: () => {
        const { currentIndex, currentPhase, scores } = get();
        const activeArray =
            currentPhase === 'global' ? GLOBAL_SCENES :
                currentPhase === 'room1' ? ROOM1_SCENES :
                    ROOM2_SCENES;

        // Reset text index when moving to next scene
        set({ textIndex: -1 });

        // If there are more scenes in current phase
        if (currentIndex < activeArray.length - 1) {
            set({ currentIndex: currentIndex + 1 });
            return;
        }

        // End of global phase -> Pivot
        if (currentPhase === 'global') {
            const { T, F } = scores;
            if (T >= F) {
                set({ currentPhase: 'room1', currentIndex: 0 });
            } else {
                set({ currentPhase: 'room2', currentIndex: 0 });
            }
            return;
        }

        // End of room phase -> Game Over
        set({ isGameOver: true });
    },

    resetGame: () => set({
        currentIndex: 0,
        currentPhase: 'global',
        textIndex: -1,
        scores: initialScores,
        isGameOver: false,
        playerName: ''
    }),

    calculateResult: () => {
        const s = get().scores;
        const mbti = [
            s.E >= s.I ? 'E' : 'I',
            s.S >= s.N ? 'S' : 'N',
            s.T >= s.F ? 'T' : 'F',
            s.J >= s.P ? 'J' : 'P'
        ].join('');

        const ARCHETYPES: Record<string, { title: string; quote: string; description: string }> = {
            'Once & Always': {
                title: "Once & Always (รักสุดท้าย)",
                quote: "“รักครั้งแรกที่ไม่มีแผนสำรอง เพราะปลายทางคือเธอคนเดียว”",
                description: "สำหรับคุณ ความรักไม่ใช่เกม และไม่ใช่การทดลอง แต่เป็นการลงหลักปักฐานทางจิตวิญญาณ คุณเป็นคนประเภทที่ไม่ได้ตกหลุมรักใครง่ายๆ เพราะกำแพงในใจถูกสร้างมาอย่างดีเพื่อคัดกรองคนที่ใช่จริง ๆ แต่เมื่อใดก็ตามที่คุณตัดสินใจเปิดประตูบานนั้นแล้ว ความรู้สึกของคุณจะกลายเป็นเส้นตรงที่พุ่งไปข้างหน้าโดยไม่มีจุดยูเทิร์น คุณมองความสัมพันธ์เป็นเรื่องระยะยาว และมักจะเผลอวาดภาพอนาคตที่มีคน ๆ นั้นอยู่ด้วยเสมอ แม้ในวันที่ความสัมพันธ์เพิ่งจะเริ่มต้น ความรักของคุณจึงเปรียบเสมือนสมอเรือที่หนักแน่น ท่ามกลางกระแสสังคมที่เปลี่ยนไปไว แต่หัวใจของคุณยังคงอยู่ที่เดิมเสมอ"
            },
            'Just Us': {
                title: "Just Us (เพื่อน)",
                quote: "“ยังอยู่ตรงนี้ในฐานะเพื่อนที่ดีที่สุด”",
                description: "คุณคือคำจำกัดความของความรักที่ใจกว้างและอบอุ่นที่สุด ความรักของคุณมักจะผุดขึ้นมาท่ามกลางความใกล้ชิด ความผูกพัน และการเป็นที่พึ่งพากันและกัน เมื่อคุณตกหลุมรักใครสักคนที่เป็นเพื่อนหรือคนใกล้ตัว คุณไม่ได้แค่ต้องการเป็นเจ้าของ แต่คุณต้องการเป็นความสุขของเขาด้วย คุณให้ความสำคัญกับตัวตนของเขามากกว่าสถานะของคุณ การที่คุณยังเลือกที่จะยืนอยู่ตรงนั้นในฐานะเพื่อน เพราะคุณเคารพในความรู้สึกของอีกฝ่ายอย่างสูงสุด คุณสามารถเปลี่ยนพลังแห่งความรักแบบคนรัก ให้กลายเป็นความปรารถนาดีแบบเพื่อนแท้ได้อย่างน่าอัศจรรย์ เป็น Safe Zone ที่แข็งแกร่งและอ่อนโยนที่สุดที่ใครคนหนึ่งจะพึงมีได้"
            },
            'Quietly': {
                title: "Quietly (แอบรัก)",
                quote: "“ความรักที่เสียงดังที่สุดแค่ในใจ และสวยงามที่สุดในความเงียบ”",
                description: "ความรักของคุณมักจะเกิดขึ้นอย่างเงียบเชียบและงดงามเหมือนงานศิลปะที่ถูกซ่อนไว้ในห้องปิด คุณมีคำพูดนับพันที่อยากบอกเขา แต่สุดท้ายคุณก็เลือกที่จะกลืนมันลงไป เพราะคุณกลัวเหลือเกินว่าความจริงจะเข้าไปทำลายความสัมพันธ์ที่แสนเปราะบาง สำหรับคุณ การได้แอบมองเขาจากระยะที่ปลอดภัย ได้เห็นรอยยิ้มของเขาในวันธรรมดา หรือได้คุยกันเรื่องสัพเพเหระ มันมีค่ามากกว่าการเสี่ยงพูดออกไปแล้วต้องกลายเป็นคนแปลกหน้าต่อกัน ในสายตาคนอื่น คุณอาจดูนิ่งเฉยจนเกือบจะดูไม่ออกว่ารัก แต่ในจักรวาลความรู้สึกของคุณ มันเต็มไปด้วยรายละเอียดและความใส่ใจ แม้ว่าตอนจบคุณอาจจะไม่ได้ลงเอยกัน แต่ความรักครั้งนี้จะถูกบันทึกไว้ในส่วนที่ลึกที่สุดของใจในฐานะความลับที่สวยงามที่สุดตลอดกาล"
            },
            'All In': {
                title: "All In (ใจกล้า)",
                quote: "“เจ็บที่ได้พูด ดีกว่าเสียใจเพราะไม่ทำอะไรเลย”",
                description: "คุณเชื่อในสัญชาตญาณและการกระทำ เมื่อหัวใจมันบอกว่าคนนี้แหละคุณจะไม่เสียเวลาอ้อมค้อมหรือเล่นเกมดึงเชิงกับใคร ความรักของคุณเต็มไปด้วย Energy และความชัดเจน คุณเชื่อว่าความรู้สึกเป็นเรื่องที่ควรสื่อสาร ไม่ใช่เรื่องที่ต้องมานั่งทายกัน การที่คุณเลือกจะเดินเข้าไปบอกความรู้สึกตรง ๆ ไม่ใช่เพราะคุณมั่นใจร้อยเปอร์เซ็นต์ว่าจะสมหวัง แต่เป็นเพราะคุณให้เกียรติหัวใจตัวเอง และไม่อยากมานั่งเสียดายในภายหลังว่ารู้อย่างนี้บอกไปก็ดี ความตรงไปตรงมานี้คือเสน่ห์ที่ทำให้ความสัมพันธ์ของคุณ เป็นความสัมพันธ์ที่มีรากฐานแข็งแรงและไม่มีความลับต่อกัน คุณพร้อมที่จะผลักดันและเติบโตไปพร้อมกับคนรัก ความรักของคุณจึงเป็นสีสันที่ฉูดฉาดและเต็มไปด้วยแรงบันลใจ"
            },
            'Before I Knew': {
                title: "Before I Knew (เผลอใจ)",
                quote: "“ไม่ได้ตั้งใจรัก แต่รู้ตัวอีกทีใจก็ไปอยู่ตรงนั้นแล้ว”",
                description: "ความรักของคุณเริ่มจากความธรรมดาที่แสนพิเศษ มันซึมลึกผ่านบทสนทนาไร้สาระและการใช้เวลาร่วมกันจนกลายเป็นความเคยชิน คุณไม่ได้ตั้งกำแพงและไม่ได้แพลนจะเปิดใจ แต่วันหนึ่งคุณกลับพบว่าพื้นที่ในหัวใจถูกภาพของคน ๆ นั้นจับจองไปหมดแล้ว ความรักของคุณจึงเป็นธรรมชาติและปราศจากการปรุงแต่ง เป็นความรู้สึกที่เรียบง่ายแต่หนักแน่น มันคือความรักที่เติบโตขึ้นมาจากความไว้วางใจและความเป็นตัวเองอย่างแท้จริง"
            },
            'Almost': {
                title: "Almost (ไปต่อไม่ได้)",
                quote: "“รักกันมาก แต่เดินไปด้วยกันไม่ได้”",
                description: "คุณมองความรักด้วยเหตุผลควบคู่ไปกับอารมณ์เสมอ ความรักครั้งแรกของคุณมักจะลึกซึ้งในระดับจิตวิญญาณ คุยกันรู้เรื่องในทุกมิติ แต่ความเจ็บปวดคือการที่ทั้งคู่ตระหนักได้ว่าแค่รักมันไม่พอ จังหวะชีวิตหรือเงื่อนไขในโลกความจริงกลายเป็นกำแพงที่ข้ามไม่ได้ ความรักแบบ Almost คือการจบกันทั้งที่ยังรัก คุณเลือกเดินออกมาไม่ใช่เพราะหมดใจ แต่เพราะรักเขามากพอที่จะไม่อยากฉุดรั้งใครไว้ในความสัมพันธ์ที่ไม่มีทางไปต่อ คุณจะจดจำเขาไว้ในฐานะคนที่ใช่ในเวลาที่ผิด เป็นความทรงจำที่สวยงามและเศร้าสร้อยที่คุณมักจะหยิบมานึกถึงในวันที่ฝนตก"
            },
            'Soft Place': {
                title: "Soft Place (สบายใจ)",
                quote: "”ไม่ใช่ความรักที่หวือหวา แต่เป็นบ้านที่แสนอบอุ่น“",
                description: "ความรักของคุณ คุณจะให้ค่ากับความสบายใจ ความสม่ำเสมอ และความรู้สึกเรียบง่ายที่ไม่ต้องพยายาม ความรักของคุณคือการอยู่ด้วยกันในห้องเงียบ ๆ ต่างคนต่างทำกิจกรรมของตัวเองแต่สัมผัสได้ถึงการมีอยู่ของกันและกัน มันเป็นความรู้สึกที่มั่นคงเหมือนพื้นดินที่รองรับฝ่าเท้า คุณไม่ต้องเกร็ง ไม่ต้องกังวลว่าพูดอะไรไปแล้วจะดูแย่ เพราะคุณรู้ว่าเขาจะรับฟังด้วยความเข้าใจ แม้เวลาจะผ่านไปนานแค่ไหน คุณจะยังจำความรู้สึกของความอบอุ่นนั้นได้เสมอ นั่นคือความรักแบบที่เดินไปข้าง ๆ กัน"
            },
            'Golden Chapter': {
                title: "Golden Chapter (สมหวัง)",
                quote: "“จบลงเพื่อกลายเป็นตำนานที่สวยที่สุด และพอแล้วสำหรับใจในตอนนั้น”",
                description: "คุณเป็นคนที่มี Passion ในความรักสูงมาก และรักครั้งแรกของคุณก็ช่างสดใส เต็มไปด้วยพลัง และสีสันเหมือนหนังวัยรุ่นฟีลกู้ด คุณทุ่มเททุกอย่างที่มีให้กับความสัมพันธ์นี้ มอบพลังบวกและเสียงหัวเราะให้กัน สร้างความทรงจำที่น่าประทับใจนับไม่ถ้วน ไม่ว่าจะเป็นการไปเที่ยวด้วยกันครั้งแรก หรือการซัพพอร์ตความฝันของกันและกัน แม้ว่าในที่สุดบทสนทนาของความสัมพันธ์จะมาถึงบรรทัดสุดท้าย แต่มันไม่ใช่ตอนจบที่เต็มไปด้วยคราบน้ำตาแห่งความแค้น แต่มันคือการ \"ขอบคุณ\" ที่ได้โคจรมาพบกัน"
            }
        };

        const mbtiMap: Record<string, string> = {
            'ISTJ': 'Once & Always', 'ISFJ': 'Once & Always',
            'INFJ': 'Quietly', 'INTJ': 'Quietly',
            'ISTP': 'Before I Knew', 'ISFP': 'Soft Place',
            'INFP': 'Quietly', 'INTP': 'Almost',
            'ESTP': 'All In', 'ESFP': 'Golden Chapter',
            'ENFP': 'Before I Knew', 'ENTP': 'Almost',
            'ESTJ': 'Soft Place', 'ESFJ': 'Just Us',
            'ENFJ': 'Golden Chapter', 'ENTJ': 'All In'
        };

        const archetypeKey = mbtiMap[mbti] || 'Golden Chapter';
        const archetypeData = ARCHETYPES[archetypeKey] || ARCHETYPES['Golden Chapter'];

        return {
            id: crypto.randomUUID(),
            userId: 'guest',
            mbti,
            archetype: archetypeKey,
            archetypeTitle: archetypeData.title,
            archetypeQuote: archetypeData.quote,
            archetypeDescription: archetypeData.description,
            scores: s,
            playedAt: new Date().toISOString()
        };
    }
}));
