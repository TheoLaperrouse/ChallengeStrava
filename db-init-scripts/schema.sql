CREATE TABLE athletes (
  id VARCHAR(255) PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL
);

CREATE TABLE "runActivities" (
  id SERIAL PRIMARY KEY,
  athlete_id VARCHAR(255) REFERENCES athletes(id),
  distance NUMERIC NOT NULL,
  time NUMERIC NOT NULL,
  speed NUMERIC NOT NULL,
  elevation_gain NUMERIC NOT NULL,
  date TIMESTAMP NOT NULL,
  CONSTRAINT results_run_unique_key UNIQUE (athlete_id, distance, time)
);

CREATE TABLE "bikeActivities" (
  id SERIAL PRIMARY KEY,
  athlete_id VARCHAR(255) REFERENCES athletes(id),
  distance NUMERIC NOT NULL,
  time NUMERIC NOT NULL,
  speed NUMERIC NOT NULL,
  elevation_gain NUMERIC NOT NULL,
  date TIMESTAMP NOT NULL,
  CONSTRAINT results_bike_unique_key UNIQUE (athlete_id, distance, time)
);


INSERT INTO athletes (id, first_name, last_name)
VALUES
('Theo L.', 'Théo', 'Laperrouse');