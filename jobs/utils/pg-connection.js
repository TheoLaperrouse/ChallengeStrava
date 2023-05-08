const { Pool } = require('pg');

export const pool = new Pool({
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  host: 'localhost',
  port: 5432,
});

export async function addPoints(data) {
    const query = `
      INSERT INTO results (athlete_id, metric_id, value, date)
      VALUES 
        ${data.map(() => `($1, $2, $3, $4)`).join(',')}
    `;
    const values = data.flatMap((result) => [result.athleteId, result.metricId, result.value, result.date]);
  
    try {
      await pool.query(query, values);
      console.log('All results inserted successfully');
    } catch (err) {
      console.error('Error inserting results', err);
    }
  }