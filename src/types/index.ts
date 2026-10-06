export interface Speaker {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  topic: string;
  timeSlot: string;
  bio: string;
  tags: string[];
  social: {
    x?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface AgendaItem {
  id: string;
  time: string;
  title: string;
  description: string;
  stage: string;
  category: 'Keynote' | 'Interactive Lab' | 'Panel' | 'Night Showcase';
  speakerIds: string[];
  day: number;
  featured?: boolean;
}

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  badge?: string;
  popular?: boolean;
  features: string[];
  available: number;
}
