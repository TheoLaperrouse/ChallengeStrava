CREATE TABLE athletes (
  id VARCHAR(255) PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL
);

CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  athlete_id VARCHAR(255) REFERENCES athletes(id),
  distance_run NUMERIC NOT NULL,
  time_run NUMERIC NOT NULL,
  speed_run NUMERIC NOT NULL,
  date TIMESTAMP NOT NULL,
  CONSTRAINT results_unique_key UNIQUE (athlete_id, distance_run, time_run)
  );

INSERT INTO athletes (id, first_name, last_name)
VALUES
('Theo L.', 'Théo', 'Laperrouse');