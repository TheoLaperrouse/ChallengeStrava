import pg from 'pg';

export const pool = new pg.Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: 'postgres',
    port: 5432,
});

export async function addPoints(data) {
    const query = `INSERT INTO activities (athlete_id, distance_run, time_run, speed_run, date) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (athlete_id, distance_run, time_run) DO NOTHING;`;

    try {
        for (const result of data) {
            const values = [result.athleteId, result.distance_run, result.time_run, result.speed_run, result.date];
            await pool.query(query, values);
        }
    } catch (err) {
        console.error('Error inserting activities', err);
    }
}

export async function getAthletesIds() {
    const query = 'SELECT id FROM athletes';
    const { rows } = await pool.query(query);
    return rows.map((row) => row.id);
}
