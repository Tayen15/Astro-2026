export type CategoryType = 'akademik' | 'olahraga' | 'esports';

export interface Competition {
  id: string;
  title: string;
  category: CategoryType;
  tagline: string;
  description: string;
  fee: number;
  maxSlots: number;
  filledSlots: number;
  scheduleDate: string;
  location: string;
  prizes: {
    first: string;
    second: string;
    third: string;
  };
  rulesSummary: string[];
  rulebookUrl: string;
  registrationUrl: string;
  contactPerson: {
    name: string;
    whatsapp: string;
  };
}

export interface EventConfig {
  name: string;
  tagline: string;
  description: string;
  registrationDeadline: string;
  totalPrizePool: string;
  generalJuknisUrl: string;
}

export interface TimelineItem {
  date: string;
  title: string;
  desc: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface AstroData {
  eventConfig: EventConfig;
  competitions: Competition[];
  timeline: TimelineItem[];
  faqs: FAQItem[];
}
