import { Story, Article } from '../types';

// Define the shape of the SQL.js library
interface SQLJs {
  Database: any;
}

let db: any = null;
let isInitialized = false;

// --- DATABASE SEED DATA ---
// This represents the initial state of the SQLite database. 
// In a production environment, this data would be populated by the Python Scraper/Ingestion pipeline.
const DB_SEED_DATA = [
  {
    id: 'story-hero-1',
    title: 'Trump’s Government Efficiency Department Disbands Eight Months Before Mandate Ends',
    summary: 'The Department of Government Efficiency, led by Elon Musk and Vivek Ramaswamy, is winding down operations earlier than expected.',
    ai_summary: JSON.stringify(['DOGE to shut down 8 months early.', 'Musk claims mission accomplished.', 'Critics argue substantial waste remains.']),
    topic: 'US Politics',
    total_sources: 394,
    last_updated: '7m read',
    bias_dist: JSON.stringify({ left: 42, center: 19, right: 39 }),
    blindspot: null,
    entities: JSON.stringify(['Elon Musk', 'Vivek Ramaswamy', 'DOGE']),
    image_url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80',
    source_ids: ['the-hindu', 'ndtv', 'republic-world', 'opindia']
  },
  {
    id: 'story-1',
    title: 'Israel Strikes Hezbollah Chief in First Beirut Attack Since June',
    summary: 'Israel\'s first strike on Beirut since June hit Haret Hreik, targeting Hezbollah chief of staff Ali Tabtabai.',
    ai_summary: JSON.stringify(['Targeted strike in Beirut suburbs.', 'At least five killed, 28 wounded.', 'Escalation in Israel-Hezbollah conflict.']),
    topic: 'Israel-Gaza',
    total_sources: 45,
    last_updated: '2 hours ago',
    bias_dist: JSON.stringify({ left: 45, center: 10, right: 45 }),
    blindspot: null,
    entities: JSON.stringify(['Hezbollah', 'Beirut', 'Israel']),
    image_url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    source_ids: ['the-wire', 'scroll', 'ndtv', 'republic-world', 'times-of-india']
  },
  {
    id: 'story-2',
    title: 'No recession risk for US economy as a whole after $11 billion shutdown hit, Bessent says',
    summary: 'Treasury Secretary Scott Bessent assures the public that the recent government shutdown will not trigger a recession.',
    ai_summary: JSON.stringify(['Shutdown cost estimated at $11 billion.', 'Economy remains resilient.', 'Inflation cooling down.']),
    topic: 'Business & Markets',
    total_sources: 9,
    last_updated: '5 hours ago',
    bias_dist: JSON.stringify({ left: 20, center: 56, right: 24 }),
    blindspot: null,
    entities: JSON.stringify(['Scott Bessent', 'US Economy', 'Recession']),
    image_url: 'https://images.unsplash.com/photo-1526304640152-d4619684e484?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    source_ids: ['the-hindu', 'ndtv', 'indian-express']
  },
  {
    id: 'story-3',
    title: 'Rep. Marjorie Taylor Greene to Resign from US Congress After Fallout with Trump',
    summary: 'MTG announces resignation following a public disagreement with former President Trump over policy direction.',
    ai_summary: JSON.stringify(['Resignation effective next month.', 'Cites irreconcilable differences.', 'Speculation on future political career.']),
    topic: 'US Politics',
    total_sources: 355,
    last_updated: '1 day ago',
    bias_dist: JSON.stringify({ left: 25, center: 45, right: 30 }),
    blindspot: null,
    entities: JSON.stringify(['Marjorie Taylor Greene', 'Donald Trump']),
    image_url: 'https://images.unsplash.com/photo-1555848962-6e79363ec58f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    source_ids: ['the-wire', 'republic-world']
  },
  {
    id: 'story-4',
    title: 'Zelenskyy says Ukraine is grateful for efforts by US, Trump',
    summary: 'Ukrainian President expresses gratitude for continued support amidst changing US political landscape.',
    ai_summary: JSON.stringify(['Zelenskyy meets US officials.', 'Discusses future aid packages.', 'Emphasizes bipartisan support.']),
    topic: 'Ukraine War',
    total_sources: 10,
    last_updated: '30 mins ago',
    bias_dist: JSON.stringify({ left: 30, center: 30, right: 40 }),
    blindspot: 'Right',
    entities: JSON.stringify(['Zelenskyy', 'Ukraine', 'Trump']),
    image_url: 'https://images.unsplash.com/photo-1605152276897-4f618f831968?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    source_ids: ['the-hindu', 'ndtv', 'republic-world']
  },
  {
    id: 'story-5',
    title: 'US Set to Label Muslim Brotherhood a Foreign Terrorist Organization: Report',
    summary: 'Reports indicate the administration is moving to designate the Muslim Brotherhood as a terrorist organization.',
    ai_summary: JSON.stringify(['Move debated for years.', 'Potential diplomatic fallout.', 'Support from certain allies.']),
    topic: 'World',
    total_sources: 120,
    last_updated: '1 day ago',
    bias_dist: JSON.stringify({ left: 0, center: 0, right: 100 }),
    blindspot: 'Left',
    entities: JSON.stringify(['Muslim Brotherhood', 'US State Dept']),
    image_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    source_ids: ['republic-world', 'opindia']
  },
  {
    id: 'story-6',
    title: 'Daughter of Holocaust Survivor Among Those Arrested at Palestine Action Protest',
    summary: 'Protests at a defense manufacturing facility led to several arrests, including descendants of Holocaust survivors.',
    ai_summary: JSON.stringify(['Protestors blocked factory entrance.', 'Police arrested 12 individuals.', 'Activists claim factory supplies IDF.']),
    topic: 'Israel-Gaza',
    total_sources: 45,
    last_updated: '2 days ago',
    bias_dist: JSON.stringify({ left: 46, center: 45, right: 9 }),
    blindspot: 'Right',
    entities: JSON.stringify(['Palestine Action', 'Protest']),
    image_url: 'https://images.unsplash.com/photo-1555848962-6e79363ec58f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    source_ids: ['the-wire', 'scroll', 'ndtv']
  }
];

// --- DATABASE SERVICE ---

export const initDatabase = async () => {
  if (isInitialized) return;

  try {
    // Load SQL.js WebAssembly
    const SQL: any = await (window as any).initSqlJs({
      locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
    });

    // Create a new database in memory
    db = new SQL.Database();

    // 1. Create Tables
    db.run(`
      CREATE TABLE stories (
        id TEXT PRIMARY KEY,
        title TEXT,
        summary TEXT,
        ai_summary TEXT, -- JSON Array
        topic TEXT,
        total_sources INTEGER,
        last_updated TEXT,
        bias_dist TEXT, -- JSON Object
        blindspot TEXT,
        entities TEXT, -- JSON Array
        image_url TEXT
      );
    `);

    db.run(`
      CREATE TABLE articles (
        id TEXT PRIMARY KEY,
        story_id TEXT,
        source_id TEXT,
        title TEXT,
        url TEXT,
        timestamp TEXT,
        FOREIGN KEY(story_id) REFERENCES stories(id)
      );
    `);

    // 2. Seed Data
    const stmtStory = db.prepare("INSERT INTO stories VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    const stmtArticle = db.prepare("INSERT INTO articles VALUES (?, ?, ?, ?, ?, ?)");

    DB_SEED_DATA.forEach(story => {
        stmtStory.run([
            story.id,
            story.title,
            story.summary,
            story.ai_summary,
            story.topic,
            story.total_sources,
            story.last_updated,
            story.bias_dist,
            story.blindspot,
            story.entities,
            story.image_url
        ]);

        // Generate articles for this story
        story.source_ids.forEach((sid, idx) => {
            stmtArticle.run([
                `art-${story.id}-${idx}`,
                story.id,
                sid,
                `${story.title} - ${idx % 2 === 0 ? 'Report' : 'Coverage'}`,
                '#',
                new Date().toISOString()
            ]);
        });
    });

    stmtStory.free();
    stmtArticle.free();

    isInitialized = true;
    console.log("Backend: SQLite Database Initialized and Seeded.");

  } catch (err) {
    console.error("Backend: Failed to initialize SQLite DB", err);
  }
};

// --- API LAYER (Backend Endpoints) ---

export const api = {
  // GET /stories?filter=...
  getStories: async (filter: 'all' | 'blindspot' | 'top' | 'hero' | 'briefing' = 'all'): Promise<Story[]> => {
    if (!db) await initDatabase();
    
    // Construct SQL Query based on filter
    let query = "SELECT * FROM stories";
    if (filter === 'blindspot') {
        query += " WHERE blindspot IS NOT NULL";
    } else if (filter === 'hero') {
        query += " WHERE id = 'story-hero-1'";
    } else if (filter === 'briefing') {
        query += " WHERE id = 'story-1'";
    }
    
    // Execute
    const result = db.exec(query);
    if (!result.length) return [];

    // Map SQL Result to Typescript Objects
    const rows = result[0].values;
    const stories: Story[] = [];

    // Fetch all articles for these stories (N+1 problem optimization usually here, but keeping simple)
    // In a real backend, we'd use JOINs or a separate call.
    
    for (const row of rows) {
      // row columns: id(0), title(1), summary(2), ai_summary(3)...
      const storyId = row[0] as string;
      const articles = await api.getArticlesForStory(storyId);

      stories.push({
        id: storyId,
        title: row[1] as string,
        summary: row[2] as string,
        aiSummaryPoints: JSON.parse(row[3] as string),
        topic: row[4] as string,
        totalSources: row[5] as number,
        lastUpdated: row[6] as string,
        biasDistribution: JSON.parse(row[7] as string),
        blindspot: row[8] as any,
        entities: JSON.parse(row[9] as string),
        imageUrl: row[10] as string,
        articles: articles
      });
    }

    if (filter === 'top') return stories.slice(2, 6); 
    return stories;
  },

  // GET /stories/:id
  getStoryById: async (id: string): Promise<Story | undefined> => {
    if (!db) await initDatabase();
    
    const result = db.exec("SELECT * FROM stories WHERE id = ?", [id]);
    if (!result.length) return undefined;

    const row = result[0].values[0];
    const articles = await api.getArticlesForStory(id);

    return {
        id: row[0] as string,
        title: row[1] as string,
        summary: row[2] as string,
        aiSummaryPoints: JSON.parse(row[3] as string),
        topic: row[4] as string,
        totalSources: row[5] as number,
        lastUpdated: row[6] as string,
        biasDistribution: JSON.parse(row[7] as string),
        blindspot: row[8] as any,
        entities: JSON.parse(row[9] as string),
        imageUrl: row[10] as string,
        articles: articles
    };
  },

  // Helper to fetch articles
  getArticlesForStory: async (storyId: string): Promise<Article[]> => {
     const res = db.exec("SELECT * FROM articles WHERE story_id = ?", [storyId]);
     if (!res.length) return [];
     
     return res[0].values.map((r: any[]) => ({
         id: r[0],
         storyId: r[1],
         sourceId: r[2],
         title: r[3],
         url: r[4],
         timestamp: r[5]
     }));
  }
};
