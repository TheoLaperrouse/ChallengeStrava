# StravaChallenge

Le projet StravaChallenge consiste en une application de visualisation de données utilisant Grafana et Postgresql pour organiser un challenge de course à pied. L'application récupère les données de l'API Strava pour chaque participant au challenge et les stocke dans une base de données Postgresql. Les données sont ensuite affichées sur un tableau de bord Grafana pour visualiser les performances de chaque athlète.

## Architecture de l'application

L'application est composée de trois parties :

1. **API de remontée de données** : une application qui récupère les données de l'API Strava et les stocke dans une base de données Postgresql.

2. **Base de données Postgresql** : stocke les données des athlètes et leurs performances.

3. **Tableau de bord Grafana** : affiche les données stockées dans la base de données Postgresql.

## Prérequis

-   Docker et docker-compose installés sur votre machine.

## Installation

1. Cloner le repository du projet :

```sh
git clone https://github.com/TheoLaperrouse/StravaChallenge.git
```

2. Créer un fichier .env à la racine du projet en se basant sur le fichier .env.example fourni. Les variables suivantes doivent être renseignées :

-   `STRAVA_CLIENT_ID` : l'identifiant de votre application Strava.
-   `STRAVA_CLIENT_SECRET` : le secret de votre application Strava.
-   `POSTGRES_USER` : le nom d'utilisateur de la base de données Postgresql.
-   `POSTGRES_PASSWORD` : le mot de passe de la base de données Postgresql.
-   `POSTGRES_DB` : le nom de la base de données Postgresql.
-   `POSTGRES_HOST` : le nom de la base de données Postgresql.
-   `PGADMIN_DEFAULT_EMAIL` : l'email pour accéder à pgAdmin
-   `PGADMIN_DEFAULT_PASSWORD` : le mot de passe pour accéder à pgAdmin

3. Si vous voulez utilisez le postgres du docker compose, modifier le datasource et pg-connection.js, enlever le SSL require.

4. Exécuter la commande suivante pour démarrer l'application :

```sh
docker compose up
```

5. Se connecter au tableau de bord Grafana à l'adresse `http://localhost:3000`

## Fonctionnement

L'application récupère les données des activités Strava pour chaque participant au challenge et les stocke dans la base de données Postgresql. Les données sont stockées dans les tables `athletes`, `activities`.

La table `athletes` stocke les informations de chaque athlète :
-   `id` : identifiant unique de l'athlète.
-   `first_name` : prénom de l'athlète.
-   `last_name` : nom de famille de l'athlète.

La table `activities` stocke les performances de chaque athlète :
-   `id` : identifiant unique de la performance
-   `athlete_id` : identifiant de l'athlète
-   `distance_run` : distance de la course
-   `time_run` : temps de la course
-   `speed_run` : vitesse de la course
-   `elevation_gain` : dénivelé positif
-   `date` : date de la course

