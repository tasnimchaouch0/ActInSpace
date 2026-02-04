-- PostgreSQL + PostGIS setup for GreenSignal
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS fields (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(255),
    geom GEOMETRY(POLYGON, 4326)
);

CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    field_id INTEGER REFERENCES fields(id),
    type VARCHAR(100),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Fields (Olive Groves in Tunisia)
INSERT INTO fields (name, geom) VALUES 
('Sfax North Grove', ST_GeomFromText('POLYGON((10.76 34.75, 10.78 34.75, 10.78 34.73, 10.76 34.73, 10.76 34.75))', 4326)),
('Mahdia Coastal', ST_GeomFromText('POLYGON((11.05 35.50, 11.07 35.50, 11.07 35.48, 11.05 35.48, 11.05 35.50))', 4326)),
('Sousse Valley', ST_GeomFromText('POLYGON((10.63 35.83, 10.65 35.83, 10.65 35.81, 10.63 35.81, 10.63 35.83))', 4326));

