const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function seed() {
    const client = await pool.connect();
    try {
        console.log('🌱 Starting database seeding...');

        // 1. Enable PostGIS
        await client.query('CREATE EXTENSION IF NOT EXISTS postgis;');
        console.log('✅ PostGIS extension enabled');

        // 2. Create tables
        await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'farmer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('✅ Users table ready');

        await client.query(`
      CREATE TABLE IF NOT EXISTS fields (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        name VARCHAR(255),
        geom GEOMETRY(POLYGON, 4326)
      );
    `);
        console.log('✅ Fields table ready');

        // 3. Create test user
        const email = 'test@zaytuna.ai';
        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);

        const userRes = await client.query(
            'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) ON CONFLICT (email) DO UPDATE SET password = $2 RETURNING id',
            [email, hashedPassword, 'farmer']
        );
        const userId = userRes.rows[0].id;
        console.log(`✅ Test user ready: ${email} (ID: ${userId})`);

        // 4. Seed fields for this user
        await client.query('DELETE FROM fields WHERE user_id = $1', [userId]);

        const fields = [
            { name: 'Sfax North Grove', geom: 'POLYGON((10.76 34.75, 10.78 34.75, 10.78 34.73, 10.76 34.73, 10.76 34.75))' },
            { name: 'Mahdia Coastal', geom: 'POLYGON((11.05 35.50, 11.07 35.50, 11.07 35.48, 11.05 35.48, 11.05 35.50))' },
            { name: 'Sousse Valley', geom: 'POLYGON((10.63 35.83, 10.65 35.83, 10.65 35.81, 10.63 35.81, 10.63 35.83))' }
        ];

        for (const f of fields) {
            await client.query(
                'INSERT INTO fields (user_id, name, geom) VALUES ($1, $2, ST_GeomFromText($3, 4326))',
                [userId, f.name, f.geom]
            );
        }
        console.log(`✅ Seeded ${fields.length} fields for user ${email}`);

        console.log('✨ Seeding completed successfully!');
    } catch (err) {
        console.error('❌ Seeding failed:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

seed();
