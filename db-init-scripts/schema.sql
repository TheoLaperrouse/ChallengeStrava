CREATE TABLE athletes (
  id VARCHAR(255) PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL
);

CREATE TABLE metrics (
  id VARCHAR(255) NOT NULL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  unit VARCHAR(255) NOT NULL
);

CREATE TABLE results (
  id SERIAL PRIMARY KEY,
  athlete_id VARCHAR(255) REFERENCES athletes(id),
  metric_id VARCHAR(255) REFERENCES metrics(id),
  value VARCHAR(255) NOT NULL,
  date TIMESTAMP NOT NULL,
  CONSTRAINT results_unique_key UNIQUE (athlete_id, metric_id, date)
);

INSERT INTO metrics (id, name, unit)
VALUES ('distance_run', 'Distance', 'km'),
       ('time_run', 'Temps', 'min'),
       ('speed_run', 'Vitesse', 'km/h');

INSERT INTO athletes (id, first_name, last_name)
VALUES
('Theo L.', 'Théo', 'Laperrouse');