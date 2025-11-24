import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import { DB_SEED_DATA } from './seed.js';

const app = express();
const PORT = 3001;

// Use 'verbose()' to get better stack traces
const sql = sqlite3.verbose();

app.use(cors());
app.use(express.json());

// Initialize SQLite Database
// Using a file path './news_data.db' ensures data persists between restarts
const db = new sql.Database('./news_data.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

function initDb() {
    db.serialize(() => {
        // Create Stories Table
        db.run(`CREATE TABLE IF NOT EXISTS stories (
            id TEXT PRIMARY KEY,
            title TEXT,
            summary TEXT,
            ai_summary TEXT,
            topic TEXT,
            total_sources INTEGER,
            last_updated TEXT,
            bias_dist TEXT,
            blindspot TEXT,
            entities TEXT,
            image_url TEXT
        )`);

        // Create Articles Table
        db.run(`CREATE TABLE IF NOT EXISTS articles (
            id TEXT PRIMARY KEY,
            story_id TEXT,
            source_id TEXT,
            title TEXT,
            url TEXT,
            timestamp TEXT,
            FOREIGN KEY(story_id) REFERENCES stories(id)
        )`);

        // Check if data exists, if not, seed it
        db.get("SELECT count(*) as count FROM stories", [], (err, row) => {
            if (err) {
                console.error(err);
                return;
            }
            if (row.count === 0) {
                console.log("Database empty, seeding data...");
                seedData();
            } else {
                console.log("Database already contains data, skipping seed.");
            }
        });
    });
}

function seedData() {
    const stmtStory = db.prepare("INSERT OR IGNORE INTO stories VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    const stmtArticle = db.prepare("INSERT OR IGNORE INTO articles VALUES (?, ?, ?, ?, ?, ?)");

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

    stmtStory.finalize();
    stmtArticle.finalize();
}

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/api/stories', (req, res) => {
    const filter = req.query.filter || 'all';
    let query = "SELECT * FROM stories";
    
    if (filter === 'blindspot') {
        query += " WHERE blindspot IS NOT NULL";
    } else if (filter === 'hero') {
        query += " WHERE id = 'story-hero-1'";
    } else if (filter === 'briefing') {
        query += " WHERE id = 'story-1'";
    }

    db.all(query, [], async (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        try {
            const stories = await Promise.all(rows.map(async (row) => {
                const articles = await new Promise((resolve, reject) => {
                    db.all("SELECT * FROM articles WHERE story_id = ?", [row.id], (err, aRows) => {
                        if (err) reject(err);
                        else resolve(aRows || []);
                    });
                });

                return {
                    id: row.id,
                    title: row.title,
                    summary: row.summary,
                    aiSummaryPoints: JSON.parse(row.ai_summary || '[]'),
                    topic: row.topic,
                    totalSources: row.total_sources,
                    lastUpdated: row.last_updated,
                    biasDistribution: JSON.parse(row.bias_dist || '{}'),
                    blindspot: row.blindspot,
                    entities: JSON.parse(row.entities || '[]'),
                    imageUrl: row.image_url,
                    articles: articles.map(a => ({
                        id: a.id,
                        storyId: a.story_id,
                        sourceId: a.source_id,
                        title: a.title,
                        url: a.url,
                        timestamp: a.timestamp
                    }))
                };
            }));

            if (filter === 'top') {
                 res.json(stories.slice(2, 6));
            } else {
                 res.json(stories);
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to process stories' });
        }
    });
});

app.get('/api/stories/:id', (req, res) => {
    const id = req.params.id;
    db.get("SELECT * FROM stories WHERE id = ?", [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Story not found' });
            return;
        }

        db.all("SELECT * FROM articles WHERE story_id = ?", [id], (err, articles) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }

            const story = {
                id: row.id,
                title: row.title,
                summary: row.summary,
                aiSummaryPoints: JSON.parse(row.ai_summary || '[]'),
                topic: row.topic,
                totalSources: row.total_sources,
                lastUpdated: row.last_updated,
                biasDistribution: JSON.parse(row.bias_dist || '{}'),
                blindspot: row.blindspot,
                entities: JSON.parse(row.entities || '[]'),
                imageUrl: row.image_url,
                articles: (articles || []).map(a => ({
                    id: a.id,
                    storyId: a.story_id,
                    sourceId: a.source_id,
                    title: a.title,
                    url: a.url,
                    timestamp: a.timestamp
                }))
            };
            res.json(story);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});