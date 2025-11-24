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
    id: 'story-1',
    title: 'New Parliament Building Inauguration Debate',
    summary: 'Opposition parties boycott the inauguration of the new Parliament building, demanding the President inaugurate it instead of the Prime Minister.',
    aiSummaryPoints: [
      '19 opposition parties announced a boycott of the ceremony.',
      'Government argues that former PMs have inaugurated buildings before.',
      'Supreme Court declined to entertain a PIL seeking inauguration by the President.',
      'Ceremony includes installation of the Sengol.'
    ],
    topic: 'Politics',
    totalSources: 45,
    lastUpdated: '2 hours ago',
    biasDistribution: { left: 45, center: 10, right: 45 },
    blindspot: null, // Balanced coverage
    entities: ['Narendra Modi', 'Parliament', 'Supreme Court', 'Sengol'],
    articles: [
      ...generateArticles(['the-wire', 'scroll', 'ndtv', 'the-hindu'], 'Opposition Boycotts Parliament Inauguration'),
      ...generateArticles(['indian-express', 'hindustan-times'], 'Parliament Building Row: Both Sides Explained'),
      ...generateArticles(['republic-world', 'opindia', 'zee-news', 'times-of-india'], 'PM Modi to Inaugurate: Historic Moment Denied by Opposition')
    ]
  },
  {
    id: 'story-2',
    title: 'State Election Results in Karnataka',
    summary: 'Congress wins a decisive victory in Karnataka assembly elections, ousting the BJP from its only southern stronghold.',
    aiSummaryPoints: [
      'Congress won 135 seats in the 224-member assembly.',
      'BJP secured 66 seats, facing anti-incumbency.',
      'Debates over CM selection between Siddaramaiah and DK Shivakumar.',
      'PM Modi had campaigned extensively in the state.'
    ],
    topic: 'Elections',
    totalSources: 82,
    lastUpdated: '5 hours ago',
    biasDistribution: { left: 60, center: 30, right: 10 },
    blindspot: 'Right', // Right wing media might be downplaying the loss
    entities: ['Karnataka', 'Congress', 'BJP', 'Siddaramaiah'],
    articles: [
      ...generateArticles(['the-hindu', 'ndtv', 'scroll', 'the-wire'], 'Congress Sweeps Karnataka'),
      ...generateArticles(['indian-express', 'hindustan-times', 'times-of-india'], 'Karnataka Verdict: Analysis'),
      ...generateArticles(['republic-world'], 'BJP Vote Share Remains Intact despite Loss')
    ]
  },
  {
    id: 'story-3',
    title: 'Economic Growth Rate Q3 Updates',
    summary: 'India reports 7.2% GDP growth, exceeding estimates and signaling strong economic recovery post-pandemic.',
    aiSummaryPoints: [
      'GDP growth beats RBI estimates.',
      'Manufacturing and construction sectors show strong rebound.',
      'Global agencies revise India\'s outlook upwards.',
      'Inflation concerns remain persistent in rural areas.'
    ],
    topic: 'Economy',
    totalSources: 30,
    lastUpdated: '1 day ago',
    biasDistribution: { left: 10, center: 20, right: 70 },
    blindspot: 'Left', // Left might be ignoring good economic news
    entities: ['GDP', 'RBI', 'Nirmala Sitharaman'],
    articles: [
      ...generateArticles(['the-wire'], 'Growth numbers hide inequality concerns'),
      ...generateArticles(['indian-express', 'hindustan-times'], 'GDP grows at 7.2%'),
      ...generateArticles(['republic-world', 'opindia', 'zee-news', 'times-of-india', 'news18'], 'India Shining: Fastest Growing Major Economy')
    ]
  },
  {
    id: 'story-4',
    title: 'Cricket World Cup Schedule Announcement',
    summary: 'BCCI and ICC announce the schedule for the ODI World Cup 2023. India vs Pakistan scheduled for Ahmedabad.',
    aiSummaryPoints: [
      'Tournament begins October 5th.',
      'Final to be held at Narendra Modi Stadium.',
      'Pakistan\'s participation was previously in doubt.',
      '10 venues selected across India.'
    ],
    topic: 'Sports',
    totalSources: 120,
    lastUpdated: '30 mins ago',
    biasDistribution: { left: 33, center: 33, right: 34 },
    blindspot: null,
    entities: ['BCCI', 'ICC', 'Virat Kohli', 'Ahmedabad'],
    articles: [
      ...generateArticles(['the-hindu', 'ndtv', 'scroll'], 'World Cup Schedule Released'),
      ...generateArticles(['indian-express', 'hindustan-times', 'times-of-india'], 'India vs Pakistan on Oct 15'),
      ...generateArticles(['republic-world', 'zee-news'], 'Ahmedabad to Host Grand Final')
    ]
  }
];

export const getStories = (filter: 'all' | 'blindspot') => {
  if (filter === 'blindspot') {
    return MOCK_STORIES.filter(s => s.blindspot !== null);
  }
  return MOCK_STORIES;
};

export const getStoryById = (id: string) => MOCK_STORIES.find(s => s.id === id);
