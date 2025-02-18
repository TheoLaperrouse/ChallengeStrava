import moment from 'moment';
import fetch from 'node-fetch';
import lodash from 'lodash';
import { BASE_STRAVA_API_URL, refreshAccessToken } from './utils/strava.js';
import { addPoints, getAthletesIds } from './utils/pg-connection.js';
import { bree } from '../index.js';
const { findIndex } = lodash;

(async () => {
    const athleteIds = await getAthletesIds();
    const token_object = await refreshAccessToken(bree.config.shared.stravaRefreshToken);

    if (token_object.refresh_token !== bree.config.shared.stravaRefreshToken) {
        bree.config.shared.stravaRefreshToken = token_object.refresh_token;
    }

    const response = await fetch(`${BASE_STRAVA_API_URL}/clubs/thorignettrunningclub/activities?per_page=100`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token_object.access_token}`,
        },
    });

    const activities = await response.json();
    const index = findIndex(activities, { distance: 5010.4 });
    const filteredActivities = index !== -1 ? activities.slice(0, index) : activities;

    const runActivities = filteredActivities
        .map((activity) => {
            const { firstname, lastname } = activity.athlete;
            const fullName = `${firstname} ${lastname}`;

            return athleteIds.includes(fullName) && ['Run', 'TrailRun'].includes(activity['sport_type'])
                ? {
                      athleteId: fullName,
                      distance_run: (activity.distance / 1000).toFixed(2),
                      time_run: (activity.moving_time / 60).toFixed(2),
                      speed_run: ((activity.distance / activity.moving_time) * 3.6).toFixed(2),
                      elevation_gain: activity.total_elevation_gain,
                      date: moment().format('YYYY-MM-DD HH:00:00'),
                  }
                : [];
        })
        .flat();

    const bikeActivities = filteredActivities
        .map((activity) => {
            const { firstname, lastname } = activity.athlete;
            const fullName = `${firstname} ${lastname}`;

            return athleteIds.includes(fullName) && activity['sport_type'] === 'Bike'
                ? {
                      athleteId: fullName,
                      distance_run: (activity.distance / 1000).toFixed(2),
                      time_run: (activity.moving_time / 60).toFixed(2),
                      speed_run: ((activity.distance / activity.moving_time) * 3.6).toFixed(2),
                      elevation_gain: activity.total_elevation_gain,
                      date: moment().format('YYYY-MM-DD HH:00:00'),
                  }
                : [];
        })
        .flat();

    if (runActivities.length > 0) {
        await addPoints(runActivities, 'run');
    }
    if (bikeActivities.length > 0) {
        await addPoints(runActivities, 'bike');
    }
    bree.stop();
})();
