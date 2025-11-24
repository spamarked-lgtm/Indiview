import { Story, BiasDistribution } from '../types';

/**
 * In a real application, this data comes from:
 * 1. RSS Feeds/Scrapers -> Raw Text
 * 2. Sentence Transformers -> Embeddings
 * 3. DBSTREAM/BERTopic -> Clusters
 * 4. OpenAI/Gemini -> Summary & Factuality check
 */

const generateArticles = (sourceIds: string[], baseTitle: string) => {
  return sourceIds.map((sid, idx) => ({
    id: `art-${Math.random().toString(36).substr(2, 9)}`,
    sourceId: sid,
    title: `${baseTitle} - ${idx % 2 === 0 ? 'Report' : 'Update'}`,
    url: '#',
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
  }));
};

export const MOCK_STORIES: Story[] = [
  {
    id: 'story-hero-1',
    title: 'Trump’s Government Efficiency Department Disbands Eight Months Before Mandate Ends',
    summary: 'The Department of Government Efficiency, led by Elon Musk and Vivek Ramaswamy, is winding down operations earlier than expected.',
    aiSummaryPoints: [
      'DOGE to shut down 8 months early.',
      'Musk claims mission accomplished.',
      'Critics argue substantial waste remains.',
      'Staff returning to private sector.'
    ],
    topic: 'US Politics',
    totalSources: 394,
    lastUpdated: '7m read',
    biasDistribution: { left: 42, center: 19, right: 39 },
    blindspot: null,
    entities: ['Elon Musk', 'Vivek Ramaswamy', 'DOGE'],
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80', // Meeting room/Government
    articles: [
      ...generateArticles(['the-hindu', 'ndtv'], 'DOGE Disbands Early'),
      ...generateArticles(['republic-world', 'opindia'], 'Musk Efficiency Drive Success')
    ]
  },
  {
    id: 'story-1',
    title: 'Israel Strikes Hezbollah Chief in First Beirut Attack Since June',
    summary: 'Israel\'s first strike on Beirut since June hit Haret Hreik, targeting Hezbollah chief of staff Ali Tabtabai.',
    aiSummaryPoints: [
      'Targeted strike in Beirut suburbs.',
      'At least five killed, 28 wounded.',
      'Escalation in Israel-Hezbollah conflict.'
    ],
    topic: 'Israel-Gaza',
    totalSources: 45,
    lastUpdated: '2 hours ago',
    biasDistribution: { left: 45, center: 10, right: 45 },
    blindspot: null, 
    entities: ['Hezbollah', 'Beirut', 'Israel'],
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // War/Conflict generic
    articles: [
      ...generateArticles(['the-wire', 'scroll', 'ndtv'], 'Beirut Airstrikes'),
      ...generateArticles(['republic-world', 'times-of-india'], 'Israel Targets Hezbollah Commander')
    ]
  },
  {
    id: 'story-2',
    title: 'No recession risk for US economy as a whole after $11 billion shutdown hit, Bessent says',
    summary: 'Treasury Secretary Scott Bessent assures the public that the recent government shutdown will not trigger a recession.',
    aiSummaryPoints: [
      'Shutdown cost estimated at $11 billion.',
      'Economy remains resilient.',
      'Inflation cooling down.'
    ],
    topic: 'Business & Markets',
    totalSources: 9,
    lastUpdated: '5 hours ago',
    biasDistribution: { left: 20, center: 56, right: 24 },
    blindspot: null,
    entities: ['Scott Bessent', 'US Economy', 'Recession'],
    imageUrl: 'https://images.unsplash.com/photo-1526304640152-d4619684e484?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Money/Business
    articles: [
      ...generateArticles(['the-hindu', 'ndtv'], 'US Economy Resilient'),
      ...generateArticles(['indian-express'], 'Bessent on Recession Risks')
    ]
  },
  {
    id: 'story-3',
    title: 'Rep. Marjorie Taylor Greene to Resign from US Congress After Fallout with Trump',
    summary: 'MTG announces resignation following a public disagreement with former President Trump over policy direction.',
    aiSummaryPoints: [
      'Resignation effective next month.',
      'Cites irreconcilable differences.',
      'Speculation on future political career.'
    ],
    topic: 'US Politics',
    totalSources: 355,
    lastUpdated: '1 day ago',
    biasDistribution: { left: 25, center: 45, right: 30 },
    blindspot: null,
    entities: ['Marjorie Taylor Greene', 'Donald Trump'],
    imageUrl: 'https://images.unsplash.com/photo-1555848962-6e79363ec58f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Politics/Congress
    articles: [
      ...generateArticles(['the-wire'], 'MTG Resigns'),
      ...generateArticles(['republic-world', 'fox-news'], 'MTG Breaks with Trump')
    ]
  },
  {
    id: 'story-4',
    title: 'Zelenskyy says Ukraine is grateful for efforts by US, Trump',
    summary: 'Ukrainian President expresses gratitude for continued support amidst changing US political landscape.',
    aiSummaryPoints: [
      'Zelenskyy meets US officials.',
      'Discusses future aid packages.',
      'Emphasizes bipartisan support.'
    ],
    topic: 'Ukraine War',
    totalSources: 10,
    lastUpdated: '30 mins ago',
    biasDistribution: { left: 30, center: 30, right: 40 },
    blindspot: 'Right',
    entities: ['Zelenskyy', 'Ukraine', 'Trump'],
    imageUrl: 'https://images.unsplash.com/photo-1605152276897-4f618f831968?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Zelenskyy/Flag
    articles: [
      ...generateArticles(['the-hindu', 'ndtv'], 'Zelenskyy Thanks US'),
      ...generateArticles(['republic-world'], 'Trump-Zelenskyy Call')
    ]
  },
  {
    id: 'story-5',
    title: 'US Set to Label Muslim Brotherhood a Foreign Terrorist Organization: Report',
    summary: 'Reports indicate the administration is moving to designate the Muslim Brotherhood as a terrorist organization.',
    aiSummaryPoints: [
      'Move debated for years.',
      'Potential diplomatic fallout.',
      'Support from certain allies.'
    ],
    topic: 'World',
    totalSources: 120,
    lastUpdated: '1 day ago',
    biasDistribution: { left: 0, center: 0, right: 100 },
    blindspot: 'Left',
    entities: ['Muslim Brotherhood', 'US State Dept'],
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Law/Gavel
    articles: [
        ...generateArticles(['republic-world', 'opindia', 'fox-news'], 'Terrorist Designation Imminent')
    ]
  },
  {
    id: 'story-6',
    title: 'Daughter of Holocaust Survivor Among Those Arrested at Palestine Action Protest',
    summary: 'Protests at a defense manufacturing facility led to several arrests, including descendants of Holocaust survivors.',
    aiSummaryPoints: [
        'Protestors blocked factory entrance.',
        'Police arrested 12 individuals.',
        'Activists claim factory supplies IDF.'
    ],
    topic: 'Israel-Gaza',
    totalSources: 45,
    lastUpdated: '2 days ago',
    biasDistribution: { left: 46, center: 45, right: 9 },
    blindspot: 'Right',
    entities: ['Palestine Action', 'Protest'],
    imageUrl: 'https://images.unsplash.com/photo-1555848962-6e79363ec58f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    articles: [
        ...generateArticles(['the-wire', 'scroll'], 'Activists Arrested'),
        ...generateArticles(['ndtv'], 'Protest Disrupted')
    ]
  }
];

export const getStories = (filter: 'all' | 'blindspot' | 'top' | 'hero' | 'briefing') => {
  if (filter === 'blindspot') {
    return MOCK_STORIES.filter(s => s.blindspot !== null);
  }
  if (filter === 'hero') {
    return [MOCK_STORIES[0]]; // The Trump/DOGE story
  }
  if (filter === 'briefing') {
    return [MOCK_STORIES[1]]; // The Israel strike story
  }
  if (filter === 'top') {
    return MOCK_STORIES.slice(2, 6); // The list of stories
  }
  return MOCK_STORIES;
};

export const getStoryById = (id: string) => MOCK_STORIES.find(s => s.id === id);