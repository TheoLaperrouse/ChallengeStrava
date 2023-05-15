import moment from 'moment';
import fetch from 'node-fetch';
import lodash from 'lodash';
import { BASE_STRAVA_API_URL, refreshAccessToken } from './utils/strava.js';
import { addPoints, getAthletesIds } from './utils/pg-connection.js';
import { bree } from '../index.js';
const { findIndex } = lodash;

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

const METRICS = [
    {
        id: 'distance_run',
        valueFn: (activity) => activity.distance / 1000,
    },
    {
        id: 'time_run',
        valueFn: (activity) => activity.moving_time / 60,
    },
    {
        id: 'speed_run',
        valueFn: (activity) => (activity.distance / activity.moving_time) * 3.6,
    },
];

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
    const index = findIndex(activities, { distance: 10054.1 });
    const filteredActivities = index !== -1 ? activities.slice(0, index) : activities;
    const points = filteredActivities
        .map((activity) => {
            const { firstname, lastname } = activity.athlete;
            const fullName = `${firstname} ${lastname}`;
            const date = moment().format('YYYY-MM-DD HH:00:00');

            return athleteIds.includes(fullName)
                ? METRICS.map((metric) => ({
                      athleteId: fullName,
                      id: metric.id,
                      value: metric.valueFn(activity).toFixed(2),
                      date,
                  }))
                : [];
        })
        .flat();
    if (points.length > 0) {
        await addPoints(points);
    }
    bree.stop();
})();
