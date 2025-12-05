export type SceneType = 'classroom' | 'computer-lab' | 'digital-city';
export type CharacterType = 'student' | 'opensource' | 'corporate' | 'teacher' | 'principal' | 'none';

export interface Choice {
  id: string;
  text: string;
  nextNode: string;
  type: 'opensource' | 'corporate' | 'neutral';
  impact?: string; // Shows how this choice affects your path
}

export interface StoryNode {
  id: string;
  scene: SceneType;
  speaker: CharacterType;
  speakerName: string;
  dialogue: string[];
  choices?: Choice[];
  isEnding?: boolean;
  endingType?: 'good' | 'bad' | 'neutral';
  reputation?: 'opensource-hero' | 'corporate-fool' | 'fence-sitter' | 'none';
}

export interface GameState {
  opensourcePoints: number;
  corporatePoints: number;
  allyCount: number;
  hasRefused: boolean;
  hasQuestioned: boolean;
}

export const storyData: Record<string, StoryNode> = {
  start: {
    id: 'start',
    scene: 'classroom',
    speaker: 'teacher',
    speakerName: 'Ms. Chen (Teacher)',
    dialogue: [
      "Good morning, class! Today we start our Digital Arts project.",
      "You'll need software to create your artwork. The school has some options...",
      "But I wanted to talk to you first, before the presentation today.",
      "Sometimes the 'obvious' choice isn't always the best one.",
      "Keep your mind open, okay?"
    ],
    choices: [
      {
        id: 'choice1-curious',
        text: "What do you mean, Ms. Chen?",
        nextNode: 'teacher-hint',
        type: 'neutral',
        impact: "You show you're willing to think critically"
      },
      {
        id: 'choice1-presentation',
        text: "I'll wait for the presentation!",
        nextNode: 'assembly-start',
        type: 'neutral',
        impact: "You want to judge for yourself"
      }
    ]
  },

  'teacher-hint': {
    id: 'teacher-hint',
    scene: 'classroom',
    speaker: 'teacher',
    speakerName: 'Ms. Chen',
    dialogue: [
      "*lowers voice*",
      "There's a software company coming today. They've been... very persuasive with the principal.",
      "They offer 'free' trials, but I've seen what happens after. Other schools got trapped.",
      "I just want you to know there are alternatives. Real free ones.",
      "But that's not my decision to make for you. Just... be careful what you sign up for."
    ],
    choices: [
      {
        id: 'choice-hint-alternatives',
        text: "What alternatives?",
        nextNode: 'teacher-alternatives',
        type: 'opensource'
      },
      {
        id: 'choice-hint-assembly',
        text: "I'll keep that in mind. Let's see the presentation.",
        nextNode: 'assembly-start',
        type: 'neutral'
      }
    ]
  },

  'teacher-alternatives': {
    id: 'teacher-alternatives',
    scene: 'classroom',
    speaker: 'teacher',
    speakerName: 'Ms. Chen',
    dialogue: [
      "There's something called Open Source software.",
      "Programs made by communities of people who believe knowledge should be shared.",
      "GIMP for image editing. Blender for 3D - it was used in Spider-Verse!",
      "Godot for making games. Inkscape for vector art. All completely free. Forever.",
      "No subscriptions. No 'trials' that turn into bills. No strings attached.",
      "And here's what's really important: your work stays yours. You can use it for decades.",
      "Open source tools are built to last. They won't disappear when a company decides profit margins matter more."
    ],
    choices: [
      {
        id: 'choice-alt-why-not',
        text: "Why doesn't the school just use those?",
        nextNode: 'teacher-explains-politics',
        type: 'opensource'
      },
      {
        id: 'choice-alt-sounds-great',
        text: "That sounds perfect! Can I try them?",
        nextNode: 'early-opensource-path',
        type: 'opensource'
      }
    ]
  },

  'teacher-explains-politics': {
    id: 'teacher-explains-politics',
    scene: 'classroom',
    speaker: 'teacher',
    speakerName: 'Ms. Chen',
    dialogue: [
      "*sighs*",
      "Companies like MegaSoft have... salespeople. Very convincing ones.",
      "They talk about 'industry standards' and 'career preparation.'",
      "They offer the first year free to schools. Get everyone dependent.",
      "Then the price goes up. And up. And the files only work in their software.",
      "Plus, they push you to upgrade constantly. It's planned obsolescence - making you buy new versions every few years.",
      "Open source? It actually rewards you for staying with older versions. You're never forced to upgrade."
    ],
    choices: [
      {
        id: 'choice-politics-assembly',
        text: "I want to see this salesperson for myself.",
        nextNode: 'assembly-start',
        type: 'neutral'
      },
      {
        id: 'choice-politics-skip',
        text: "I've heard enough. Show me the free tools!",
        nextNode: 'early-opensource-path',
        type: 'opensource'
      }
    ]
  },

  'assembly-start': {
    id: 'assembly-start',
    scene: 'computer-lab',
    speaker: 'principal',
    speakerName: 'Principal Morrison',
    dialogue: [
      "Students, I'm excited to introduce our new technology partner!",
      "MegaSoft Creative Suite will transform how you learn digital arts!",
      "I'll let their representative explain the... generous offer.",
      "*steps aside, looking slightly uncomfortable*"
    ],
    choices: [
      {
        id: 'choice-assembly-listen',
        text: "Listen to the presentation",
        nextNode: 'corporate-pitch',
        type: 'neutral'
      }
    ]
  },

  'corporate-pitch': {
    id: 'corporate-pitch',
    scene: 'computer-lab',
    speaker: 'corporate',
    speakerName: 'Victor Shade (MegaSoft Rep)',
    dialogue: [
      "*adjusts red tie, flashes a too-wide smile*",
      "Hello, future creators! I'm Victor, and I'm here to give you... everything.",
      "MegaSoft Creative Suite. The ONLY software professionals use.",
      "And for your school? The first year is completely FREE.",
      "That's right. No cost. No catch. Just... opportunity.",
      "*his eyes seem to glint red for just a moment*"
    ],
    choices: [
      {
        id: 'choice-pitch-suspicious',
        text: "What happens after the first year?",
        nextNode: 'corporate-deflect',
        type: 'opensource'
      },
      {
        id: 'choice-pitch-excited',
        text: "Free sounds amazing! Tell me more!",
        nextNode: 'corporate-hook',
        type: 'corporate'
      }
    ]
  },

  'corporate-deflect': {
    id: 'corporate-deflect',
    scene: 'computer-lab',
    speaker: 'corporate',
    speakerName: 'Victor Shade',
    dialogue: [
      "*smile falters for a microsecond*",
      "Ah, a smart one. I like that. Future business leader, perhaps?",
      "After the trial, there's a small... investment. $30 per student, per month.",
      "But think of it as investing in your FUTURE. Can you put a price on success?",
      "Besides, by then you'll have all your projects saved in our format.",
      "You wouldn't want to lose all that hard work, would you?"
    ],
    choices: [
      {
        id: 'choice-deflect-calculate',
        text: "Wait... $30 times 500 students times 12 months...",
        nextNode: 'student-math',
        type: 'opensource'
      },
      {
        id: 'choice-deflect-format',
        text: "What do you mean 'your format'?",
        nextNode: 'corporate-lockin',
        type: 'opensource'
      }
    ]
  },

  'corporate-hook': {
    id: 'corporate-hook',
    scene: 'computer-lab',
    speaker: 'corporate',
    speakerName: 'Victor Shade',
    dialogue: [
      "*leans in conspiratorially*",
      "I knew I liked you. A true visionary.",
      "Just imagine - the same tools used by Hollywood studios! On YOUR computer!",
      "All your friends will be using it. All the tutorials online are for it.",
      "You don't want to be... left behind, do you?",
      "*his shadow seems longer than it should be*"
    ],
    choices: [
      {
        id: 'choice-hook-signup',
        text: "Where do I sign up?",
        nextNode: 'corporate-trap-1',
        type: 'corporate'
      },
      {
        id: 'choice-hook-doubt',
        text: "Hmm, let me think about it first...",
        nextNode: 'corporate-pressure',
        type: 'neutral'
      }
    ]
  },

  'student-math': {
    id: 'student-math',
    scene: 'computer-lab',
    speaker: 'student',
    speakerName: 'You',
    dialogue: [
      "That's... $180,000 per year for our school alone!",
      "And that's just one school. They must be making millions from this!",
      "No wonder they can afford to give the first year 'free.'",
      "We're not customers. We're... the product."
    ],
    choices: [
      {
        id: 'choice-math-confront',
        text: "This doesn't seem right.",
        nextNode: 'corporate-exposed',
        type: 'opensource'
      }
    ]
  },

  'corporate-lockin': {
    id: 'corporate-lockin',
    scene: 'computer-lab',
    speaker: 'corporate',
    speakerName: 'Victor Shade',
    dialogue: [
      "*waves hand dismissively*",
      "Oh, just technical details. Our files are... optimized.",
      "They work best in MegaSoft. For your protection, really.",
      "Other software might... corrupt your precious work.",
      "*smiles, but it doesn't reach his eyes*",
      "Trust me. We only want what's best for you.",
      "Besides, in 5 years when we release MegaSoft v8, you'll need the latest hardware to run it."
    ],
    choices: [
      {
        id: 'choice-lockin-doubt',
        text: "That sounds like a trap...",
        nextNode: 'corporate-exposed',
        type: 'opensource'
      },
      {
        id: 'choice-lockin-accept',
        text: "I guess that makes sense...",
        nextNode: 'corporate-trap-1',
        type: 'corporate'
      }
    ]
  },

  'corporate-pressure': {
    id: 'corporate-pressure',
    scene: 'computer-lab',
    speaker: 'corporate',
    speakerName: 'Victor Shade',
    dialogue: [
      "*expression hardens almost imperceptibly*",
      "Think about it? Of course, of course...",
      "But remember - this offer expires TODAY.",
      "Miss it, and you'll be years behind your classmates.",
      "Is that really what you want? To be... ordinary?",
      "*the lights flicker slightly*"
    ],
    choices: [
      {
        id: 'choice-pressure-resist',
        text: "I don't respond well to pressure tactics.",
        nextNode: 'corporate-exposed',
        type: 'opensource'
      },
      {
        id: 'choice-pressure-cave',
        text: "Okay, okay! I'll sign up!",
        nextNode: 'corporate-trap-1',
        type: 'corporate'
      }
    ]
  },

  'corporate-exposed': {
    id: 'corporate-exposed',
    scene: 'computer-lab',
    speaker: 'opensource',
    speakerName: 'Alex (Steps forward)',
    dialogue: [
      "*a student stands up from the back*",
      "Hey! Don't listen to him!",
      "I transferred from Riverside School. They fell for this EXACT pitch.",
      "Three years later? Art program gutted. Budget drained by subscriptions.",
      "Half the computers sit unused because they can't afford enough licenses.",
      "There's another way. A better way."
    ],
    choices: [
      {
        id: 'choice-exposed-listen',
        text: "Tell me more!",
        nextNode: 'alex-truth',
        type: 'opensource'
      },
      {
        id: 'choice-exposed-victor',
        text: "Is this true, Mr. Shade?",
        nextNode: 'corporate-defense',
        type: 'neutral'
      }
    ]
  },

  'corporate-defense': {
    id: 'corporate-defense',
    scene: 'computer-lab',
    speaker: 'corporate',
    speakerName: 'Victor Shade',
    dialogue: [
      "*his charming facade cracks, revealing something darker*",
      "Riverside made... poor financial decisions. Not our concern.",
      "Every school that partners with us gets the PRIVILEGE of industry tools.",
      "This child speaks of 'free' software. Amateur tools for amateurs.",
      "Do you want to be a professional, or do you want to play pretend?",
      "*his shadow seems to twist unnaturally*"
    ],
    choices: [
      {
        id: 'choice-defense-alex',
        text: "Actually, I want to hear what Alex has to say.",
        nextNode: 'alex-truth',
        type: 'opensource'
      },
      {
        id: 'choice-defense-stay',
        text: "Maybe he has a point about being professional...",
        nextNode: 'corporate-trap-1',
        type: 'corporate'
      }
    ]
  },

  'alex-truth': {
    id: 'alex-truth',
    scene: 'digital-city',
    speaker: 'opensource',
    speakerName: 'Alex',
    dialogue: [
      "*leads you away from the assembly*",
      "Look, I get it. His pitch is compelling. That's what makes it dangerous.",
      "But here's what he won't tell you: the 'industry standard' is changing.",
      "Blender - a free 3D program - was used to make Oscar-winning films.",
      "GIMP has features that match Photoshop. Krita is beloved by concept artists.",
      "The difference? They're made BY artists, FOR artists. Not for shareholders."
    ],
    choices: [
      {
        id: 'choice-truth-proof',
        text: "But can free software really compete?",
        nextNode: 'alex-proof',
        type: 'opensource'
      },
      {
        id: 'choice-truth-community',
        text: "Why would people make software for free?",
        nextNode: 'alex-philosophy',
        type: 'opensource'
      }
    ]
  },

  'alex-proof': {
    id: 'alex-proof',
    scene: 'digital-city',
    speaker: 'opensource',
    speakerName: 'Alex',
    dialogue: [
      "Let me show you something.",
      "*pulls out a tablet with stunning digital artwork*",
      "I made all of this. Game assets, animations, even a short film.",
      "Total cost? Zero. My skills? Transferable to ANY software.",
      "Because I learned principles, not just one company's buttons.",
      "And when I share my work, I'm not locked into their ecosystem."
    ],
    choices: [
      {
        id: 'choice-proof-game',
        text: "Show me something you've created?",
        nextNode: 'alex-free-game',
        type: 'opensource'
      },
      {
        id: 'choice-proof-teach',
        text: "Could you teach me?",
        nextNode: 'learning-path',
        type: 'opensource'
      },
      {
        id: 'choice-proof-school',
        text: "But what about the school's decision?",
        nextNode: 'school-choice',
        type: 'opensource'
      }
    ]
  },

  'alex-free-game': {
    id: 'alex-free-game',
    scene: 'digital-city',
    speaker: 'opensource',
    speakerName: 'Alex',
    dialogue: [
      "Oh, I'm glad you asked!",
      "I actually made a free game you can play right now.",
      "It's hosted here: https://gilded-sfogliatella-a7fe39.netlify.app/",
      "It's completely free, no ads, no tracking.",
      "Check it out and see what's possible when you create with open tools."
    ],
    choices: [
      {
        id: 'choice-game-impressed',
        text: "That's amazing! I'll play it.",
        nextNode: 'learning-path',
        type: 'opensource'
      },
      {
        id: 'choice-game-back',
        text: "Thanks, maybe later.",
        nextNode: 'alex-philosophy',
        type: 'opensource'
      }
    ]
  },

  'alex-philosophy': {
    id: 'alex-philosophy',
    scene: 'digital-city',
    speaker: 'opensource',
    speakerName: 'Alex',
    dialogue: [
      "That's the beautiful part.",
      "Some believe knowledge shouldn't be gatekept by corporations.",
      "When you improve open source software, EVERYONE benefits.",
      "A kid in Brazil, a teacher in Japan, a studio in France - all using the same tools.",
      "No one profits by keeping others out. We rise together.",
      "That's not naive - that's how the internet itself was built."
    ],
    choices: [
      {
        id: 'choice-philosophy-inspired',
        text: "That's... actually really inspiring.",
        nextNode: 'learning-path',
        type: 'opensource'
      },
      {
        id: 'choice-philosophy-school',
        text: "Can we convince the school?",
        nextNode: 'school-choice',
        type: 'opensource'
      }
    ]
  },

  'corporate-trap-1': {
    id: 'corporate-trap-1',
    scene: 'computer-lab',
    speaker: 'corporate',
    speakerName: 'Victor Shade',
    dialogue: [
      "*grins widely, teeth gleaming*",
      "Excellent choice. Welcome to the MegaSoft family.",
      "Just sign here... and here... and initial here...",
      "*hands over a tablet with tiny, scrolling text*",
      "Don't worry about reading it all. Standard terms. Everyone signs them.",
      "*his eyes flash red as you sign*"
    ],
    choices: [
      {
        id: 'choice-trap1-continue',
        text: "...",
        nextNode: 'corporate-trap-2',
        type: 'corporate'
      }
    ]
  },

  'corporate-trap-2': {
    id: 'corporate-trap-2',
    scene: 'classroom',
    speaker: 'student',
    speakerName: 'You (6 months later)',
    dialogue: [
      "The software is amazing... but something feels wrong.",
      "They keep asking me to 'upgrade' for features I thought were included.",
      "My friend tried to open my project on their home computer. It wouldn't work.",
      "'Incompatible format.' They'd need to buy MegaSoft too.",
      "And I just got an email... the free trial ends next month."
    ],
    choices: [
      {
        id: 'choice-trap2-email',
        text: "Read the email...",
        nextNode: 'corporate-trap-3',
        type: 'corporate'
      }
    ]
  },

  'corporate-trap-3': {
    id: 'corporate-trap-3',
    scene: 'classroom',
    speaker: 'corporate',
    speakerName: 'MegaSoft Email',
    dialogue: [
      "Dear Valued Future Customer,",
      "Your free trial of MegaSoft Creative Suite expires in 30 days.",
      "To continue accessing your 47 saved projects, please upgrade to:",
      "Student Plan: $29.99/month | Pro Plan: $59.99/month",
      "Note: Projects cannot be exported to other formats after trial ends.",
      "We're confident you'll make the right choice. - The MegaSoft Team"
    ],
    choices: [
      {
        id: 'choice-trap3-panic',
        text: "All my work... trapped?!",
        nextNode: 'corporate-trap-4',
        type: 'corporate'
      }
    ]
  },

  'corporate-trap-4': {
    id: 'corporate-trap-4',
    scene: 'computer-lab',
    speaker: 'student',
    speakerName: 'You',
    dialogue: [
      "I spent months on these projects. I can't just lose them!",
      "But $30 a month... that's $360 a year. I don't have that kind of money.",
      "And even if I pay, they could raise the price whenever they want.",
      "Why didn't anyone warn me about this?",
      "*remembers Ms. Chen's words*"
    ],
    choices: [
      {
        id: 'choice-trap4-teacher',
        text: "Maybe Ms. Chen can help...",
        nextNode: 'teacher-rescue',
        type: 'opensource'
      },
      {
        id: 'choice-trap4-pay',
        text: "I'll just have to pay... somehow.",
        nextNode: 'corporate-bad-ending',
        type: 'corporate'
      }
    ]
  },

  'teacher-rescue': {
    id: 'teacher-rescue',
    scene: 'classroom',
    speaker: 'teacher',
    speakerName: 'Ms. Chen',
    dialogue: [
      "*looks at you with understanding, not judgment*",
      "I tried to warn you. But some lessons have to be learned.",
      "Here's the good news: your SKILLS aren't trapped. Your creativity isn't.",
      "And there's a tool called 'format converters' - not perfect, but they help.",
      "More importantly, I know someone who can help you transition.",
      "Meet me after school. And don't worry - we'll get through this."
    ],
    choices: [
      {
        id: 'choice-rescue-after',
        text: "After school...",
        nextNode: 'redemption-meeting',
        type: 'opensource'
      }
    ]
  },

  'redemption-meeting': {
    id: 'redemption-meeting',
    scene: 'digital-city',
    speaker: 'opensource',
    speakerName: 'Alex',
    dialogue: [
      "*is waiting with Ms. Chen*",
      "Hey, I heard what happened. No shame - those companies are predatory.",
      "I've helped three other students escape the MegaSoft trap.",
      "Your projects might not transfer perfectly, but here's the thing:",
      "You'll rebuild them. Faster this time. With skills that belong to YOU.",
      "And no corporation will ever hold your creativity hostage again."
    ],
    choices: [
      {
        id: 'choice-meeting-learn',
        text: "Teach me. I'm ready to learn the right way.",
        nextNode: 'redemption-ending',
        type: 'opensource'
      }
    ]
  },


  'late-redemption': {
    id: 'late-redemption',
    scene: 'computer-lab',
    speaker: 'opensource',
    speakerName: 'Alex',
    dialogue: [
      "It's never too late.",
      "Every artist I admire has a story of starting over.",
      "The tools don't define you. Your vision does.",
      "Let's rebuild - not just your projects, but your relationship with creating.",
      "This time, on your terms. Free. Forever.",
      "Welcome to the open source community."
    ],
    choices: [
      {
        id: 'choice-late-redemption-end',
        text: "Thank you. I'm ready.",
        nextNode: 'redemption-ending',
        type: 'opensource'
      }
    ]
  },

  'early-opensource-path': {
    id: 'early-opensource-path',
    scene: 'computer-lab',
    speaker: 'opensource',
    speakerName: 'Alex',
    dialogue: [
      "*approaches with a warm smile*",
      "Hey! Ms. Chen told me you were interested in the real free tools!",
      "I'm Alex. I've been using open source software for years.",
      "It changed everything for me. No more worrying about subscriptions.",
      "No more feeling like I'm renting my own creativity.",
      "Want me to show you around?"
    ],
    choices: [
      {
        id: 'choice-early-yes',
        text: "Yes, please!",
        nextNode: 'learning-path',
        type: 'opensource'
      }
    ]
  },

  'learning-path': {
    id: 'learning-path',
    scene: 'computer-lab',
    speaker: 'opensource',
    speakerName: 'Alex',
    dialogue: [
      "Okay, let's start simple.",
      "For drawing and painting: Krita. Used by professional concept artists.",
      "For photo editing: GIMP. Different interface, same power as the paid stuff.",
      "For 3D: Blender. This one's legendary - studios use it for Hollywood films.",
      "For games: Godot. The engine is free AND you own everything you make.",
      "The best part? Thousands of free tutorials, because the community WANTS you to succeed."
    ],
    choices: [
      {
        id: 'choice-learn-try',
        text: "Let's make something!",
        nextNode: 'first-project',
        type: 'opensource'
      },
      {
        id: 'choice-learn-community',
        text: "Tell me more about this community.",
        nextNode: 'community-deep',
        type: 'opensource'
      }
    ]
  },

  'school-choice': {
    id: 'school-choice',
    scene: 'classroom',
    speaker: 'teacher',
    speakerName: 'Ms. Chen',
    dialogue: [
      "You two have been talking. Good.",
      "Here's the truth: the principal is under pressure. Budget cuts.",
      "Victor's 'free year' looked like a lifeline.",
      "But if students show there's another way... if you present an alternative...",
      "Adults listen when young people speak with conviction.",
      "Would you be willing to make that case?"
    ],
    choices: [
      {
        id: 'choice-school-yes',
        text: "Yes. Let's show them what open source can do.",
        nextNode: 'presentation-prep',
        type: 'opensource'
      }
    ]
  },

  'presentation-prep': {
    id: 'presentation-prep',
    scene: 'computer-lab',
    speaker: 'student',
    speakerName: 'You (2 weeks later)',
    dialogue: [
      "We've been working non-stop. Alex taught me Blender, Krita, GIMP...",
      "I made things I never thought I could. A 3D model. Digital paintings.",
      "And the online community helped whenever I got stuck.",
      "Today we present to the school board. I'm nervous but...",
      "This feels important. Not just for me. For everyone."
    ],
    choices: [
      {
        id: 'choice-prep-present',
        text: "Time to present...",
        nextNode: 'presentation',
        type: 'opensource'
      }
    ]
  },

  'presentation': {
    id: 'presentation',
    scene: 'classroom',
    speaker: 'student',
    speakerName: 'You (To the School Board)',
    dialogue: [
      "Members of the board, you've heard MegaSoft's pitch.",
      "What they didn't tell you: after year one, this school would pay $180,000 annually.",
      "And our students' work would be locked in formats only their software can open.",
      "I have an alternative. In two weeks, using entirely free, open source tools...",
      "*shows portfolio* I created all of this. Professional quality. Zero cost.",
      "The question isn't 'can we afford open source.' It's 'can we afford not to?'"
    ],
    choices: [
      {
        id: 'choice-present-result',
        text: "...",
        nextNode: 'board-decision',
        type: 'opensource'
      },
      {
        id: 'choice-present-repair',
        text: "Also highlight repairability and sustainability",
        nextNode: 'repair-and-durability',
        type: 'opensource'
      }
    ]
  },

  'repair-and-durability': {
    id: 'repair-and-durability',
    scene: 'classroom',
    speaker: 'student',
    speakerName: 'You (To the School Board)',
    dialogue: [
      "Before I finish, one more practical point.",
      "Open formats mean our files will still open in ten years.",
      "Repairable hardware and modular components keep machines working longer.",
      "Choosing tools that are interoperable reduces e-waste and saves money.",
      "We can teach repair skills, accept donations, and favor devices that last.",
      "This is how we make technology durable — for people and for the planet."
    ],
    choices: [
      {
        id: 'choice-repair-to-board',
        text: "That's the case we need to make.",
        nextNode: 'board-decision',
        type: 'opensource'
      }
    ]
  },

  'board-decision': {
    id: 'board-decision',
    scene: 'classroom',
    speaker: 'principal',
    speakerName: 'Principal Morrison',
    dialogue: [
      "*looks between Victor Shade and the student presentation*",
      "I... I had no idea about the long-term costs.",
      "Mr. Shade, I think we need to reconsider our partnership.",
      "*Victor's face twists with barely concealed fury*",
      "Thank you, students. You may have just saved our art program.",
      "*Victor storms out, his shadow seeming to writhe*"
    ],
    choices: [
      {
        id: 'choice-decision-end',
        text: "We did it!",
        nextNode: 'good-ending',
        type: 'opensource'
      }
    ]
  },

  'community-deep': {
    id: 'community-deep',
    scene: 'digital-city',
    speaker: 'opensource',
    speakerName: 'Alex',
    dialogue: [
      "The community is the soul of open source.",
      "People from every country, every background, working together.",
      "Not for profit. For the simple belief that creation should be accessible to all.",
      "When you learn open source, you join a global family.",
      "You can contribute back - fixing bugs, writing tutorials, making art.",
      "You're not just a user. You're part of something bigger."
    ],
    choices: [
      {
        id: 'choice-community-join',
        text: "I want to be part of that.",
        nextNode: 'first-project',
        type: 'opensource'
      }
    ]
  },

  'first-project': {
    id: 'first-project',
    scene: 'computer-lab',
    speaker: 'student',
    speakerName: 'You (One month later)',
    dialogue: [
      "I can't believe it. I made my first game!",
      "It's simple - just a little platformer - but it's MINE.",
      "I drew the sprites in Krita, modeled the 3D elements in Blender...",
      "Put it all together in Godot. And I can share it with anyone.",
      "No subscriptions. No corporate overlords. Just... pure creation.",
      "This is what freedom feels like."
    ],
    choices: [
      {
        id: 'choice-first-end',
        text: "This is just the beginning.",
        nextNode: 'good-ending',
        type: 'opensource'
      }
    ]
  },

  'good-ending': {
    id: 'good-ending',
    scene: 'digital-city',
    speaker: 'opensource',
    speakerName: 'Alex',
    dialogue: [
      "You know what you did today?",
      "You didn't just learn software. You chose freedom over convenience.",
      "You chose tools that will work in 10 years, not just this quarter.",
      "You stood up against corporations that see schools as cash machines.",
      "And you proved that the best tools don't have to cost anything, or demand constant upgrades.",
      "Your work is yours forever. Your old computer will run these tools forever.",
      "That's real durability. That's respect for the planet and your wallet.",
      "The open source community is glad to have you.",
      "Now go create something amazing - and help others understand: sustainable tech is possible."
    ],
    isEnding: true,
    endingType: 'good'
  },

  'redemption-ending': {
    id: 'redemption-ending',
    scene: 'digital-city',
    speaker: 'student',
    speakerName: 'You',
    dialogue: [
      "I learned the hard way. But I learned.",
      "Those months with MegaSoft taught me something important:",
      "When someone offers you something 'free' with strings attached... run.",
      "Real freedom has no expiration date. No hidden fees. No hostage-taking.",
      "Real durability means tools you'll use for decades, not quarters.",
      "Open source gave me my creativity back. And my old computer keeps working.",
      "And now? I help others escape the same trap I fell into.",
      "That's how we build sustainable technology - together."
    ],
    isEnding: true,
    endingType: 'good'
  },

  'corporate-bad-ending': {
    id: 'corporate-bad-ending',
    scene: 'classroom',
    speaker: 'student',
    speakerName: 'You (One year later)',
    dialogue: [
      "I'm still paying MegaSoft. $30 every month. Every. Single. Month.",
      "They raised it to $34.99 last quarter. Said it was for 'premium support.'",
      "My friends using open source are creating amazing things... for free.",
      "I could switch now, but all my projects are in their proprietary format.",
      "I'm trapped. Not by any legal contract, but by my own inertia and sunk costs.",
      "I finally understand: the trap wasn't the signing. It was the staying."
    ],
    isEnding: true,
    endingType: 'bad'
  },

  'questioning-path': {
    id: 'questioning-path',
    scene: 'computer-lab',
    speaker: 'corporate',
    speakerName: 'Victor Shade',
    dialogue: [
      "*expression darkens*",
      "You're asking a lot of difficult questions, aren't you?",
      "I thought you were smart enough to see the real opportunity here.",
      "But if you're going to be... difficult about this.",
      "Maybe this software isn't for you. There are cheaper... I mean, other options.",
      "*turns away dismissively*"
    ],
    choices: [
      {
        id: 'choice-questioning-standalone',
        text: "Find your own path",
        nextNode: 'independent-learner',
        type: 'neutral'
      }
    ]
  },

  'independent-learner': {
    id: 'independent-learner',
    scene: 'digital-city',
    speaker: 'student',
    speakerName: 'You',
    dialogue: [
      "After Victor rejected me, I felt... strangely free.",
      "So I started exploring on my own. YouTube tutorials. Forums. Communities.",
      "I discovered KRITA. Blender. Godot. GIMP. All free. All powerful.",
      "And I realized - I don't need to be part of any corporate 'family.'",
      "I just needed curiosity. And it turns out, that's enough.",
      "Better than enough - it's everything."
    ],
    choices: [
      {
        id: 'choice-independent-end',
        text: "I found my own way",
        nextNode: 'neutral-ending',
        type: 'neutral'
      }
    ]
  },

  'neutral-ending': {
    id: 'neutral-ending',
    scene: 'computer-lab',
    speaker: 'student',
    speakerName: 'You (Final reflection)',
    dialogue: [
      "It wasn't the most dramatic path. No heroic presentations. No drama.",
      "But I learned something valuable: you don't need permission to create.",
      "You don't need a corporation. You don't need a school endorsement.",
      "You just need to be brave enough to try, curious enough to explore.",
      "That's the real lesson. Freedom isn't given - it's taken.",
      "By choosing, by learning, by refusing to accept 'no' for an answer."
    ],
    isEnding: true,
    endingType: 'neutral'
  }
};

export const getNode = (nodeId: string): StoryNode => {
  return storyData[nodeId] || storyData.start;
};
