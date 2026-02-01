const { Pool } = require('pg');

// Database connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

/**
 * Initialize database - create quizzes table if it doesn't exist
 */
async function initDatabase() {
    const client = await pool.connect();
    try {
        await client.query(`
      CREATE TABLE IF NOT EXISTS quizzes (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(500) NOT NULL,
        questions JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('✅ Database initialized successfully');
    } catch (error) {
        console.error('❌ Database initialization error:', error);
        throw error;
    } finally {
        client.release();
    }
}

/**
 * Get all quizzes from database
 */
async function getAllQuizzes() {
    try {
        const result = await pool.query(
            'SELECT id, name, questions, created_at FROM quizzes ORDER BY created_at DESC'
        );
        return result.rows.map(row => ({
            id: row.id,
            name: row.name,
            questions: row.questions
        }));
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        return [];
    }
}

/**
 * Create a new quiz
 */
async function createQuiz(id, name, questions) {
    try {
        await pool.query(
            'INSERT INTO quizzes (id, name, questions) VALUES ($1, $2, $3)',
            [id, name, JSON.stringify(questions)]
        );
        return { id, name, questions };
    } catch (error) {
        console.error('Error creating quiz:', error);
        throw error;
    }
}

/**
 * Get a single quiz by ID
 */
async function getQuizById(quizId) {
    try {
        const result = await pool.query(
            'SELECT id, name, questions FROM quizzes WHERE id = $1',
            [quizId]
        );
        if (result.rows.length === 0) return null;

        const row = result.rows[0];
        return {
            id: row.id,
            name: row.name,
            questions: row.questions
        };
    } catch (error) {
        console.error('Error fetching quiz by ID:', error);
        return null;
    }
}

/**
 * Delete a quiz by ID
 */
async function deleteQuiz(quizId) {
    try {
        await pool.query('DELETE FROM quizzes WHERE id = $1', [quizId]);
        return true;
    } catch (error) {
        console.error('Error deleting quiz:', error);
        return false;
    }
}

module.exports = {
    initDatabase,
    getAllQuizzes,
    createQuiz,
    getQuizById,
    deleteQuiz,
    pool
};
