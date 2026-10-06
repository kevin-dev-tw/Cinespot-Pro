import type { Speaker, AgendaItem, TicketTier } from '../types';

export const EVENT_DETAILS = {
  title: "SYNTHESIS // 2026",
  tagline: "WHERE ARCHITECTURE DISINTEGRATES INTO PURE COMPUTATION",
  dates: "OCTOBER 28—30, 2026",
  location: "TOKYO ARCH & SPATIAL PAVILION, JAPAN",
  coordinates: "35.6762° N, 139.6503° E",
  stats: [
    { label: "Visionary Attendees", value: "3,500+" },
    { label: "Global Keynotes", value: "42" },
    { label: "Hands-on Labs", value: "18" },
    { label: "Participating Countries", value: "64" },
  ]
};

export const SPEAKERS: Speaker[] = [
  {
    id: "elena-rostova",
    name: "Elena Rostova",
    role: "Head of Fluid Systems & Interaction",
    company: "Locomotive Studio / Zurich",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
    topic: "The Kinematics of Code: Engineering Emotional Friction on the Web",
    timeSlot: "Day 01 • 10:30 AM",
    bio: "Pioneer in scroll-based web choreography, inertia physics, and non-Euclidean user interfaces. Former design lead behind award-winning digital installations in Paris, Basel, and Tokyo.",
    tags: ["WebGL", "Motion Physics", "Locomotive Engine"],
    social: {
      x: "https://twitter.com",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      website: "https://elenarostova.design"
    }
  },
  {
    id: "kenji-takahashi",
    name: "Kenji Takahashi",
    role: "Founder & Creative Technologist",
    company: "Rhizome Spatial Media",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    topic: "Neural Architecture: When Physical Spaces Become Interactive Screens",
    timeSlot: "Day 01 • 02:00 PM",
    bio: "Tokyo-based media architect melding responsive structural facades with real-time generative shaders. His works have been exhibited at Mori Art Museum and Venice Biennale.",
    tags: ["Spatial Computing", "Generative AI", "Architecture"],
    social: {
      x: "https://twitter.com",
      github: "https://github.com",
      website: "https://kenjitakahashi.jp"
    }
  },
  {
    id: "maya-svensson",
    name: "Dr. Maya Svensson",
    role: "Principal AI Aesthetician",
    company: "Symbiosis Intelligence Lab",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
    topic: "Synthetic Dreams: Diffusion Models as Creative Co-Architects",
    timeSlot: "Day 02 • 11:15 AM",
    bio: "Theoretical computer scientist researching the emergent visual languages of ultra-scale neural networks. Advisor to leading creative studios across Stockholm, London, and San Francisco.",
    tags: ["Generative Models", "Computational Art", "Ethics"],
    social: {
      x: "https://twitter.com",
      linkedin: "https://linkedin.com"
    }
  },
  {
    id: "mateo-silva",
    name: "Mateo Silva",
    role: "Design Director & Typographic Sculptor",
    company: "Bureau Monolith",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
    topic: "Oversized Brutalism: Reclaiming Raw Human Expression in UI",
    timeSlot: "Day 02 • 03:45 PM",
    bio: "World-renowned visual director famed for monumental variable typefaces and anti-trend digital identities for contemporary art institutions and avant-garde fashion houses.",
    tags: ["Variable Type", "Editorial Design", "Modern Brutalism"],
    social: {
      github: "https://github.com",
      website: "https://mateosilva.work"
    }
  },
  {
    id: "amara-chen",
    name: "Amara Chen",
    role: "VP Creative Engineering",
    company: "Hyperobject Collective",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop",
    topic: "Real-time Photorealism in Browser: WebGPU & Fluid Dynamics",
    timeSlot: "Day 03 • 01:30 PM",
    bio: "Pioneering author of high-performance fragment shader libraries and interactive liquid simulators running at silky 120 FPS on next-gen browser engines.",
    tags: ["WebGPU", "Fluid Shaders", "High-FPS Graphics"],
    social: {
      x: "https://twitter.com",
      github: "https://github.com",
      linkedin: "https://linkedin.com"
    }
  },
  {
    id: "soren-kjaer",
    name: "Søren Kjær",
    role: "Spatial Sound Architect",
    company: "Echoculture CPH",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop",
    topic: "Binaural Synthesis: Designing Audio that Moves With Your Cursor",
    timeSlot: "Day 03 • 04:00 PM",
    bio: "Grammy-nominated acoustic engineer transforming digital interfaces through multi-channel algorithmic resonance and procedural soundscapes.",
    tags: ["Spatial Audio", "Acoustics", "Web Audio API"],
    social: {
      x: "https://twitter.com",
      website: "https://sorenkjaer.audio"
    }
  }
];

export const AGENDA_ITEMS: AgendaItem[] = [
  {
    id: "ag-01",
    day: 1,
    time: "09:00 — 10:15",
    title: "Opening Ceremony: The Post-Screen Paradigm",
    description: "Welcome keynote tracing the collapse of traditional screen constraints into ambient spatial computing environments.",
    stage: "Main Sanctuary (Stage A)",
    category: "Keynote",
    speakerIds: ["kenji-takahashi"],
    featured: true
  },
  {
    id: "ag-02",
    day: 1,
    time: "10:30 — 12:00",
    title: "The Kinematics of Code: Engineering Emotional Friction on the Web",
    description: "Deep dive into scroll-based inertia physics, spring algorithms, and why perfect mechanical precision makes websites feel sterile.",
    stage: "Stage B (Fluid Room)",
    category: "Keynote",
    speakerIds: ["elena-rostova"],
    featured: true
  },
  {
    id: "ag-03",
    day: 1,
    time: "01:30 — 03:00",
    title: "Hands-on Masterclass: Building Locomotive Scroll Experiences",
    description: "Step-by-step interactive lab constructing multi-layer parallax scenes, smooth skews, and pinned canvas viewports.",
    stage: "Lab Sandbox 01",
    category: "Interactive Lab",
    speakerIds: ["elena-rostova", "amara-chen"]
  },
  {
    id: "ag-04",
    day: 1,
    time: "03:30 — 05:00",
    title: "Roundtable: Will Code Ever Replace the Art Director's Eye?",
    description: "Heated discourse between generative model researchers and legendary visual designers on agency, craft, and soul.",
    stage: "The Forum",
    category: "Panel",
    speakerIds: ["maya-svensson", "mateo-silva"]
  },
  {
    id: "ag-05",
    day: 1,
    time: "07:30 — 11:00",
    title: "Nocturne: Audio-Visual Spatial Rave & Laser Performance",
    description: "Immersive warehouse takeover featuring 360-degree reactive visual projection mapping and algorithmic live-coding techno.",
    stage: "Subterranean Dome",
    category: "Night Showcase",
    speakerIds: ["soren-kjaer", "kenji-takahashi"]
  },
  {
    id: "ag-06",
    day: 2,
    time: "09:30 — 11:00",
    title: "Synthetic Dreams: Diffusion Models as Creative Co-Architects",
    description: "Live prototyping session training custom LoRA models on physical architectural maquettes to generate emergent geometry.",
    stage: "Main Sanctuary (Stage A)",
    category: "Keynote",
    speakerIds: ["maya-svensson"],
    featured: true
  },
  {
    id: "ag-07",
    day: 2,
    time: "11:30 — 01:00",
    title: "WebGPU Deep Waters: Compute Shaders for Millions of Particles",
    description: "Write raw WGSL compute shaders directly in the browser to simulate gravitational physics and turbulent fluids.",
    stage: "Lab Sandbox 02",
    category: "Interactive Lab",
    speakerIds: ["amara-chen"]
  },
  {
    id: "ag-08",
    day: 2,
    time: "02:30 — 04:00",
    title: "Oversized Brutalism: Monumental Typography in Contemporary Media",
    description: "Deconstructing why massive grotesque typography has become the defining visual vernacular of the avant-garde.",
    stage: "Stage B (Fluid Room)",
    category: "Keynote",
    speakerIds: ["mateo-silva"],
    featured: true
  },
  {
    id: "ag-09",
    day: 2,
    time: "05:00 — 06:30",
    title: "The Future of Design Tooling: From Figma to Procedural Canvas",
    description: "Panel session discussing how engineering and design workflows are converging into unified programmable canvases.",
    stage: "The Forum",
    category: "Panel",
    speakerIds: ["elena-rostova", "mateo-silva"]
  },
  {
    id: "ag-10",
    day: 3,
    time: "10:00 — 11:45",
    title: "Spatial Sound as UI: When Sound Informs Touch",
    description: "Interactive auditory exploration demonstrating how 3D haptic audio drastically accelerates spatial comprehension.",
    stage: "Acoustic Chamber",
    category: "Keynote",
    speakerIds: ["soren-kjaer"]
  },
  {
    id: "ag-11",
    day: 3,
    time: "01:30 — 03:30",
    title: "Hackathon Final Presentations: Experimental Web Artifacts",
    description: "Top 8 jury-selected teams showcase 48-hour experimental prototypes built with WebGPU, Framer Motion, and generative sound.",
    stage: "Main Sanctuary (Stage A)",
    category: "Interactive Lab",
    speakerIds: ["kenji-takahashi", "maya-svensson", "amara-chen"]
  },
  {
    id: "ag-12",
    day: 3,
    time: "05:00 — 09:00",
    title: "Closing Keynote & Global After-Hours Summit Party",
    description: "Celebration across Tokyo skyline terrace with ambient sound sets, cocktail pairings, and networking.",
    stage: "Sky Garden Level 54",
    category: "Night Showcase",
    speakerIds: ["elena-rostova", "soren-kjaer"],
    featured: true
  }
];

export const TICKET_TIERS: TicketTier[] = [
  {
    id: "tier-general",
    name: "General Explorer",
    price: 480,
    features: [
      "Full access to 3-day Keynote Stages",
      "Access to Exhibition & Digital Art Gallery",
      "Opening & Closing Keynotes",
      "Digital Summit Vault & Session Recordings",
      "Tokyo Networking Lounge Access"
    ],
    available: 120
  },
  {
    id: "tier-pro",
    name: "All-Access Pro",
    price: 890,
    popular: true,
    badge: "MOST POPULAR",
    features: [
      "All General Explorer Benefits",
      "Priority seating in Main Sanctuary Stage",
      "Access to All 18 Hands-on Interactive Labs",
      "Reserved Entry to Nocturne AV Showcase",
      "Locomotive Masterclass Source Code & Assets",
      "Official 2026 Hardware Swag Package"
    ],
    available: 34
  },
  {
    id: "tier-patron",
    name: "VIP Patron & Lab Pass",
    price: 1650,
    badge: "ULTRA LIMITED",
    features: [
      "All All-Access Pro Benefits",
      "Private VIP Lounge & Speaker Green Room Access",
      "Exclusive 1-on-1 Speaker Dinner in Ginza",
      "Sky Garden Level 54 Private Afterparty",
      "Custom Monolith NFC Event Pass",
      "1-Year Access to Experimental Design Guild"
    ],
    available: 9
  }
];

export const MANIFESTO_ITEMS = [
  {
    number: "01",
    title: "Fluid Inertia",
    desc: "We reject static, lifeless interfaces. Movement is not an afterthought or mere garnish; it is the fundamental physics through which humans perceive digital weight, momentum, and intention."
  },
  {
    number: "02",
    title: "Monumental Scale",
    desc: "Oversized typography commands presence. By embracing unapologetic grotesque proportions, type ceases to be merely read and transforms into sculptural architecture."
  },
  {
    number: "03",
    title: "Asymmetric Rhythm",
    desc: "Boring symmetrical grids breed predictability. Controlled visual tension, off-kilter alignments, and layered negative space awaken curiosity and emotional resonance."
  },
  {
    number: "04",
    title: "Cinematic Atmosphere",
    desc: "Deep ink depths, radiant neon accents, and procedural grain compose an immersive nocturnal environment engineered for deep artistic focus."
  }
];
