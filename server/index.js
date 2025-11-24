const express = require('express');
const sqlite3 = require('sqlite3');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;
const sql = sqlite3.verbose();

app.use(cors());
app.use(express.json());

// Initialize SQLite Database
const dbPath = path.resolve(__dirname, '../news_data.db');
const db = new sql.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // We do not seed here anymore; the Python pipeline handles writes.
        // We only ensure read capability.
    }
});

// --- API ROUTES ---

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', db: 'connected' });
});

app.get('/api/stories', (req, res) => {
    const filter = req.query.filter || 'all';
    let query = "SELECT * FROM clusters ORDER BY updated_at DESC";
    
    if (filter === 'blindspot') {
        query = "SELECT * FROM clusters WHERE blindspot IS NOT NULL ORDER BY updated_at DESC";
    } else if (filter === 'top') {
        query = "SELECT * FROM clusters ORDER BY source_count DESC LIMIT 10";
    } else if (filter === 'briefing') {
         query = "SELECT * FROM clusters ORDER BY created_at DESC LIMIT 1";
    } else if (filter === 'hero') {
         query = "SELECT * FROM clusters ORDER BY source_count DESC LIMIT 1";
    }

    db.all(query, [], async (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        try {
            // Helper to safe parse JSON
            const parseJSON = (str, fallback) => {
                try { return str ? JSON.parse(str) : fallback; } 
                catch (e) { return fallback; }
            };

            // Transform DB rows to Frontend Types
            const stories = await Promise.all(rows.map(async (row) => {
                // Fetch articles for this cluster to get images/sources
                const articles = await new Promise((resolve) => {
                    db.all("SELECT * FROM articles WHERE cluster_id = ? LIMIT 5", [row.cluster_id], (err, aRows) => {
                        resolve(aRows || []);
                    });
                });

                return {
                    id: row.cluster_id,
                    title: row.topic_label,
                    summary: row.summary,
                    aiSummaryPoints: parseJSON(row.ai_summary, [row.summary]),
                    topic: row.category || 'General',
                    totalSources: row.source_count,
                    lastUpdated: new Date(row.updated_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), 
                    biasDistribution: parseJSON(row.bias_distribution, { left: 0, center: 0, right: 0 }),
                    blindspot: row.blindspot,
                    entities: parseJSON(row.topic_keywords, []),
                    imageUrl: row.image_url,
                    articles: articles.map(a => ({
                        id: a.article_id,
                        title: a.title,
                        sourceId: a.source_id,
                        url: a.source_url
                    }))
                };
            }));

            res.json(stories);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to process stories' });
        }
    });
});

app.get('/api/stories/:id', (req, res) => {
    const id = req.params.id;
    db.get("SELECT * FROM clusters WHERE cluster_id = ?", [id], (err, row) => {
        if (err || !row) {
            res.status(404).json({ error: 'Story not found' });
            return;
        }

        db.all("SELECT * FROM articles WHERE cluster_id = ?", [id], (err, articles) => {
            const parseJSON = (str, fallback) => {
                try { return str ? JSON.parse(str) : fallback; } 
                catch (e) { return fallback; }
            };

            const story = {
                id: row.cluster_id,
                title: row.topic_label,
                summary: row.summary,
                aiSummaryPoints: parseJSON(row.ai_summary, []),
                topic: row.category || 'General',
                totalSources: row.source_count,
                lastUpdated: row.updated_at,
                biasDistribution: parseJSON(row.bias_distribution, { left: 0, center: 0, right: 0 }),
                blindspot: row.blindspot,
                entities: parseJSON(row.topic_keywords, []),
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
                    nerEntities: parseJSON(a.ner_entities, []),
                    embeddingVector: parseJSON(a.embedding_vector, [])
                }))
            };
            res.json(story);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Node Server running on http://localhost:${PORT}`);
});
