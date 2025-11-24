export enum Bias {
  FarLeft = 'Far-Left',
  Left = 'Left',
  CenterLeft = 'Center-Left',
  Center = 'Center',
  CenterRight = 'Center-Right',
  Right = 'Right',
  FarRight = 'Far-Right',
}

export interface Source {
  id: string;
  name: string;
  bias: Bias;
  icon?: string;
  region?: string; // e.g., National, South, North
}

export interface Article {
  id: string;
  sourceId: string;
  sourceName?: string;
  title: string;
  url: string;
  timestamp: string;
  summary?: string;
  content?: string;
  imageUrl?: string;
  language?: string;
  nerEntities?: string[];
  embeddingVector?: number[];
  storyId?: string; // Corresponds to cluster_id
}

export interface BiasDistribution {
  left: number; // percentage 0-100
  center: number; // percentage 0-100
  right: number; // percentage 0-100
}

export interface Story {
  id: string;
  title: string;
  summary: string;
  aiSummaryPoints: string[];
  totalSources: number;
  lastUpdated: string;
  biasDistribution: BiasDistribution;
  blindspot?: 'Left' | 'Right' | 'Center' | null;
  articles: Article[];
  entities: string[]; // Extracted via NER
  topic: string; // e.g., Politics, Business
  imageUrl?: string;
}

export type ViewState = 'feed' | 'blindspots' | 'story_detail';
