CREATE TABLE athletes (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL
);

CREATE TABLE metrics (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  unit VARCHAR(255) NOT NULL
);

CREATE TABLE results (
  id SERIAL PRIMARY KEY,
  athlete_id INTEGER REFERENCES athletes(id),
  metric_id INTEGER REFERENCES metrics(id),
  value NUMERIC NOT NULL,
  date TIMESTAMP NOT NULL
);