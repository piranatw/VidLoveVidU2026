import type { GameScene } from '../types';

export const GLOBAL_SCENES: GameScene[] = [
    // --- NARRATIVE INTRO ---
    {
        type: 'narrative',
        dialogue: [
            "ยินดีต้อนรับ\nนับจากตอนนี้คุณคือ\n\"เด็กมอปลาย\"\nในโรงเรียนของเรา"
        ],
        background: 'scene-1'
    },
    {
        type: 'narrative',
        dialogue: [
            "เช้าวันใหม่\nคุณตื่นขึ้นมาเตรียมตัว\nพร้อมไปโรงเรียน\nเหมือนเช่นเคย",
        ],
        background: 'scene-2'
    },
    {
        type: 'narrative',
        dialogue: [
            "วันแห่งความรัก\nวนเวียนมาอีกปีแล้วสิ",
        ],
        background: 'scene-3'
    },
    {
        type: 'narrative',
        dialogue: [
            "เช้านี้มีอะไรกินบ้างนะ",
        ],
        background: 'scene-4'
    },

    // --- PHASE 1: GLOBAL QUESTIONS (Q1 - Q4) ---
    {
        type: 'question',
        text: "อาหารในจานมีทั้งหมด 4 อย่างคุณจะเลือกทานอะไรเป็นอันดับแรก",
        background: 'scene-5',
        choices: [
            { text: "ไข่ดาว", traits: { T: 3 }, position: { top: '40%', left: '33%' } },
            { text: "ขนมปัง", traits: { T: 1 }, position: { top: '30%', left: '15%' } },
            { text: "ไส้กรอก", traits: { F: 3 }, position: { top: '65%', left: '30%' } },
            { text: "ผักสลัด", traits: { F: 1 }, position: { top: '37%', left: '65%' } }
        ]
    },
    {
        type: 'narrative',
        dialogue: [
            "ดีจัง วันนี้แม่ไปส่งด้วย",
        ],
        background: 'scene-6'
    },

    {
        type: 'question',
        text: "เช้าวันนี้โรงเรียนจัดติวพิเศษในช่วงเวลาเข้าแถวคุณจะเลือกนั่งตรงไหนของห้อง",
        background: 'scene-7',
        choices: [
            { text: "A", traits: { E: 3 }, position: { top: '50%', left: '52%' } },
            { text: "B", traits: { E: 1 }, position: { top: '64%', left: '10%' } },
            { text: "C", traits: { I: 3 }, position: { top: '82%', left: '5%' } },
            { text: "D", traits: { I: 1 }, position: { top: '64%', left: '82%' } }
        ]
    },
    {
        type: 'question',
        text: "ในวันแรกของฉันคุณต้องอ่านหนังสือ 1 เล่ม คุณจะเลือกอ่านเล่มหนังสือเล่มไหน",
        background: 'scene-8',
        choices: [
            { text: "หนังสือปรัชญา", traits: { T: 4 } },
            { text: "หนังสือนิยายสืบสาน", traits: { T: 2 } },
            { text: "หนังสือนวนิยายชีวิต", traits: { F: 4 } },
            { text: "หนังสือจิตวิทยา", traits: { F: 2 } }
        ]
    },
    {
        type: 'narrative',
        dialogue: [
            "เสียงกริ่งพักเที่ยงดังขึ้น โรงเรียนคึกคักกว่าปกติ",
        ],
        background: 'scene-1'
    },

    {
        type: 'question',
        text: "ช่วงพักกลางวันวันนี้ร้านที่คุณกินประจำคนแน่นเป็นพิเศษ คุณจะ?",
        background: 'scene-9',
        choices: [
            { text: "ต่อคิวร้านเดิม", traits: { S: 4 } },
            { text: "ไปร้านที่เพื่อนทาน", traits: { N: 4 } },
            { text: "ต่อคิวร้านใหม่ ที่คนน้อย", traits: { S: 2 } },
            { text: "ต่อคิวร้านใหม่ ที่ไม่มีคนเลย", traits: { N: 2 } }
        ]
    },

    {
        type: 'narrative',
        dialogue: [
            "วันนี้เป็นวันวาเลนไทน์ แต่ทุกอย่างก็เหมือนวันธรรมดา",
            "แต่เหมือนจะไม่ธรรมดาสำหรับคุณ"
        ],
        background: 'scene-1'
    },
    {
        type: 'narrative',
        dialogue: [
            "คุณกำลังคิดถึงช่วงบ่าย\nชมรมที่เลือกไว้\nคนที่อาจได้เจอ",
        ],
        background: 'scene-3'
    },
];

export const ROOM1_SCENES: GameScene[] = [
    // --- PHASE 2: BRANCHED (ROOM 1 - THINKING PATH) ---
    {
        type: 'question',
        text: "ชมรมที่คุณเลือกเข้าคือชมรมไหน",
        background: 'scene-10',
        choices: [
            { text: "ชมรมโต้วาที", traits: { I: 4 } },
            { text: "ชมรมการศึกษา", traits: { I: 2 } },
            { text: "ชมรมถ่ายภาพ", traits: { E: 4 } },
            { text: "ชมรมหมากรุก", traits: { E: 2 } }
        ]
    },
    {
        type: 'question',
        text: "ในชมรมคุณมักเป็นคนแบบไหน",
        background: 'scene-10',
        choices: [
            { text: "คนวางแผน", traits: { J: 3 } },
            { text: "คนวางระบบหลังบ้าน", traits: { J: 1 } },
            { text: "คนลงมือแก้ปัญหาเฉพาะหน้า", traits: { P: 3 } },
            { text: "คนที่ช่วยตรงที่ขาด", traits: { P: 1 } }
        ]
    },
    {
        type: 'narrative',
        dialogue: [
            "คุณดูจะเป็นที่รักของคนในชมรมนี้นะ...",
            "แต่คนที่คุณสนใจมากที่สุดดันเป็นเขาคนนั้น"
        ],
        background: 'scene-1'
    },
    {
        type: 'question',
        text: "ถ้าคุณแอบชอบใครสักคนเขาจะเป็นคนแบบไหน",
        background: 'scene-11',
        choices: [
            { text: "มีความเป็นผู้ใหญ่ เสมอต้นเสมอปลาย", traits: { J: 4 } },
            { text: "คนที่สุภาพ มีระเบียบ เรียบร้อย", traits: { J: 2 } },
            { text: "คนที่รักอิสระ เป็นตัวของตัวเอง", traits: { P: 4 } },
            { text: "คนที่มีความเป็นเด็กสนุกสนาน", traits: { P: 2 } }
        ]
    },
    {
        type: 'narrative',
        dialogue: [
            "คุณดูจะเข้ากับเขาได้ดีเลย"
        ],
        background: 'scene-1'
    },
    {
        type: 'narrative',
        dialogue: [
            "แต่ไหน ๆ ก็วันวาเลนไทน์แล้ว"
        ],
        background: 'scene-12'
    },
    {
        type: 'question',
        text: "สิ่งที่คุณจะให้กับเขาในวันวาเลนไทน์ คืออะไร",
        background: 'scene-12',
        choices: [
            { text: "ดอกไม้", traits: { S: 3 } },
            { text: "ช็อคโกแลต", traits: { N: 3 } },
            { text: "สติกเกอร์หัวใจ", traits: { S: 1 } },
            { text: "การ์ดความรู้สึก", traits: { N: 3 } }
        ]
    },
    {
        type: 'narrative',
        dialogue: [
            "โรแมนติกจังเลยนะ",
            "เราก็มีของจะมอบให้คุณเหมือนกัน"
        ],
        background: 'scene-1'
    },
];

export const ROOM2_SCENES: GameScene[] = [
    // --- PHASE 2: BRANCHED (ROOM 2 - FEELING PATH) ---
    {
        type: 'question',
        text: "ชมรมที่คุณเลือกเข้าคือชมรมไหน",
        background: 'scene-13',
        choices: [
            { text: "ชมรมการแสดง", traits: { E: 4 } },
            { text: "ชมรมดนตรี", traits: { E: 2 } },
            { text: "ชมรมวาดภาพ", traits: { I: 4 } },
            { text: "ชมรมปลูกต้นไม้", traits: { I: 2 } }
        ]
    },
    {
        type: 'question',
        text: "ในชมรมคุณมักเป็นคนแบบไหน",
        background: 'scene-13',
        choices: [
            { text: "คนคอยดูแลบรรยากาศ", traits: { J: 3 } },
            { text: "คนที่ทุกคนพึ่งพาได้", traits: { J: 1 } },
            { text: "คนที่ทำตามฟีลในแต่ละวัน", traits: { P: 3 } },
            { text: "คนที่อยู่ตรงไหนก็ได้", traits: { P: 1 } }
        ]
    },
    {
        type: 'narrative',
        dialogue: [
            "คุณดูจะเป็นที่รักของคนในชมรมนี้นะ",
            "แต่คนที่คุณสนใจมากที่สุดดันเป็นเขาคนนั้น"
        ],
        background: 'scene-1'
    },
    {
        type: 'question',
        text: "ถ้าคุณแอบชอบใครสักคนในชมรม เขาจะเป็นคนแบบไหน",
        background: 'scene-11',
        choices: [
            { text: "คนที่มีความเป็นผู้ใหญ่ อบอุ่น", traits: { J: 4 } },
            { text: "คนที่ใส่ใจคนรอบตัว", traits: { J: 2 } },
            { text: "สนุกสนานอยู่ด้วยแล้วไม่เครียด", traits: { P: 4 } },
            { text: "คนที่จริงใจ เป็นตัวเอง", traits: { P: 2 } }
        ]
    },
    {
        type: 'narrative',
        dialogue: [
            "คุณดูจะเข้ากับเขาได้ดีเลย"
        ],
        background: 'scene-1'
    },
    {
        type: 'narrative',
        dialogue: [
            "แต่ไหน ๆ ก็วันวาเลนไทน์แล้ว"
        ],
        background: 'scene-12'
    },
    {
        type: 'question',
        text: "สิ่งที่คุณจะให้กับเขาในวันวาเลนไทน์ คืออะไร",
        background: 'scene-12',
        choices: [
            { text: "ดอกไม้", traits: { S: 3 } },
            { text: "ช็อคโกแลต", traits: { N: 3 } },
            { text: "สติกเกอร์หัวใจ", traits: { S: 1 } },
            { text: "การ์ดความรู้สึก", traits: { N: 3 } }
        ]
    },
    {
        type: 'narrative',
        dialogue: [
            "โรแมนติกจังเลยนะ",
            "เราก็มีของจะมอบให้คุณเหมือนกัน"
        ],
        background: 'scene-1'
    },

];
