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
const db = new sql.Database('./news_data.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Enable Foreign Keys
        db.run("PRAGMA foreign_keys = ON", (err) => {
             if (err) console.error("Failed to enable foreign keys:", err);
             else initDb();
        });
    }
});

function initDb() {
    db.serialize(() => {
        // Drop tables if they exist to ensure schema update during development
        db.run("DROP TABLE IF EXISTS articles");
        db.run("DROP TABLE IF EXISTS stories"); // Cleanup old table
        db.run("DROP TABLE IF EXISTS clusters"); 

        // Create Clusters Table
        db.run(`CREATE TABLE IF NOT EXISTS clusters (
            cluster_id TEXT PRIMARY KEY,
            created_at TEXT,
            updated_at TEXT,
            topic_label TEXT,
            topic_keywords TEXT,
            representative_embedding TEXT,
            article_ids TEXT,
            summary TEXT,
            bias_distribution TEXT,
            source_count INTEGER,
            language_distribution TEXT,
            is_active INTEGER,
            
            -- UI Support Columns
            image_url TEXT,
            blindspot TEXT,
            ai_summary TEXT,
            category TEXT
        )`);

        // Create Articles Table
        db.run(`CREATE TABLE IF NOT EXISTS articles (
            article_id TEXT PRIMARY KEY,
            source_id TEXT,
            source_name TEXT,
            source_url TEXT,
            title TEXT,
            summary TEXT,
            content TEXT,
            published_at TEXT,
            collected_at TEXT,
            image_url TEXT,
            language TEXT,
            ner_entities TEXT,
            embedding_vector TEXT,
            cluster_id TEXT,
            FOREIGN KEY(cluster_id) REFERENCES clusters(cluster_id) ON DELETE CASCADE
        )`);

        // Check if data exists, if not, seed it
        db.get("SELECT count(*) as count FROM clusters", [], (err, row) => {
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
    const stmtCluster = db.prepare(`
        INSERT OR IGNORE INTO clusters (
            cluster_id, created_at, updated_at, topic_label, topic_keywords, 
            representative_embedding, article_ids, summary, bias_distribution, 
            source_count, language_distribution, is_active, 
            image_url, blindspot, ai_summary, category
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const stmtArticle = db.prepare(`
        INSERT OR IGNORE INTO articles (
            article_id, source_id, source_name, source_url, title, summary, content, 
            published_at, collected_at, image_url, language, ner_entities, 
            embedding_vector, cluster_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Helper to map source IDs to nice names
    const getSourceName = (id) => {
        const map = {
            'the-hindu': 'The Hindu', 'ndtv': 'NDTV', 'the-wire': 'The Wire',
            'indian-express': 'Indian Express', 'times-of-india': 'Times of India',
            'republic-world': 'Republic World', 'opindia': 'OpIndia', 'scroll': 'Scroll.in',
            'zee-news': 'Zee News', 'hindustan-times': 'Hindustan Times', 'news18': 'News18'
        };
        return map[id] || id;
    };

    db.serialize(() => {
        DB_SEED_DATA.forEach(cluster => {
            // Generate article IDs
            const generatedArticleIds = cluster.source_ids.map((_, idx) => `art-${cluster.cluster_id}-${idx}`);

            stmtCluster.run([
                cluster.cluster_id,
                cluster.created_at,
                cluster.updated_at,
                cluster.topic_label,
                cluster.topic_keywords,
                cluster.representative_embedding,
                JSON.stringify(generatedArticleIds),
                cluster.summary,
                cluster.bias_distribution,
                cluster.source_count,
                cluster.language_distribution,
                cluster.is_active,
                cluster.image_url,
                cluster.blindspot,
                cluster.ai_summary,
                cluster.category
            ]);

            cluster.source_ids.forEach((sid, idx) => {
                stmtArticle.run([
                    `art-${cluster.cluster_id}-${idx}`,       // article_id
                    sid,                                      // source_id (internal)
                    getSourceName(sid),                       // source_name
                    '#',                                      // source_url
                    `${cluster.topic_label}: ${getSourceName(sid)} Coverage`, // title
                    cluster.summary,                          // summary
                    'Full content not available in seed...',  // content
                    new Date().toISOString(),                 // published_at
                    new Date().toISOString(),                 // collected_at
                    cluster.image_url,                        // image_url
                    'en',                                     // language
                    cluster.topic_keywords,                   // ner_entities
                    JSON.stringify([0.1, 0.2, 0.3]),          // embedding_vector
                    cluster.cluster_id                        // cluster_id
                ]);
            });
        });

        stmtCluster.finalize();
        stmtArticle.finalize();
        console.log("Seeding complete.");
    });
}

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/api/stories', (req, res) => {
    const filter = req.query.filter || 'all';
    let query = "SELECT * FROM clusters";
    
    // Map existing frontend filters to new DB structure
    if (filter === 'blindspot') {
        query += " WHERE blindspot IS NOT NULL";
    } else if (filter === 'hero') {
        query += " WHERE cluster_id = 'story-hero-1'";
    } else if (filter === 'briefing') {
        query += " WHERE cluster_id = 'story-1'";
    }

    db.all(query, [], async (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        try {
            const stories = await Promise.all(rows.map(async (row) => {
                const articles = await new Promise((resolve, reject) => {
                    db.all("SELECT * FROM articles WHERE cluster_id = ?", [row.cluster_id], (err, aRows) => {
                        if (err) reject(err);
                        else resolve(aRows || []);
                    });
                });

                return {
                    id: row.cluster_id,
                    title: row.topic_label,
                    summary: row.summary,
                    aiSummaryPoints: JSON.parse(row.ai_summary || '[]'),
                    topic: row.category,
                    totalSources: row.source_count,
                    lastUpdated: row.updated_at, 
                    biasDistribution: JSON.parse(row.bias_distribution || '{}'),
                    blindspot: row.blindspot,
                    entities: JSON.parse(row.topic_keywords || '[]'),
                    imageUrl: row.image_url,
                    articles: articles.map(a => ({
                        id: a.article_id,
                        storyId: a.cluster_id,
                        sourceId: a.source_id,
                        sourceName: a.source_name,
                        title: a.title,
                        url: a.source_url,
                        timestamp: a.published_at,
                        summary: a.summary,
                        language: a.language,
                        nerEntities: JSON.parse(a.ner_entities || '[]'),
                        embeddingVector: JSON.parse(a.embedding_vector || '[]') // Mapped correctly
                    }))
                };
            }));

            if (filter === 'top') {
                 // Return stories that aren't hero or briefing for 'top' section
                 res.json(stories.filter(s => s.id !== 'story-hero-1' && s.id !== 'story-1').slice(0, 5));
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
    db.get("SELECT * FROM clusters WHERE cluster_id = ?", [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Story not found' });
            return;
        }

        db.all("SELECT * FROM articles WHERE cluster_id = ?", [id], (err, articles) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }

            const story = {
                id: row.cluster_id,
                title: row.topic_label,
                summary: row.summary,
                aiSummaryPoints: JSON.parse(row.ai_summary || '[]'),
                topic: row.category,
                totalSources: row.source_count,
                lastUpdated: row.updated_at,
                biasDistribution: JSON.parse(row.bias_distribution || '{}'),
                blindspot: row.blindspot,
                entities: JSON.parse(row.topic_keywords || '[]'),
                imageUrl: row.image_url,
                articles: (articles || []).map(a => ({
                    id: a.article_id,
                    storyId: a.cluster_id,
                    sourceId: a.source_id,
                    sourceName: a.source_name,
                    title: a.title,
                    url: a.source_url,
                    timestamp: a.published_at,
                    summary: a.summary,
                    language: a.language,
                    nerEntities: JSON.parse(a.ner_entities || '[]'),
                    embeddingVector: JSON.parse(a.embedding_vector || '[]')
                }))
            };
            res.json(story);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});