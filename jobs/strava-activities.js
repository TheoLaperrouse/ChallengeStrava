import moment from 'moment';
import fetch from 'node-fetch';
import { BASE_STRAVA_API_URL, refreshAccessToken } from './utils/strava.js';
import { addPoints, getAthletesIds } from './utils/pg-connection.js';
import { bree } from '../index.js';

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
    const start = moment().subtract(20, 'days');
    const end = moment().format(DATE_FORMAT);

    console.log(`Starting import from ${start.format(DATE_FORMAT)} to ${end}`);

    const token_object = await refreshAccessToken(bree.config.shared.stravaRefreshToken);

    if (token_object.refresh_token !== bree.config.shared.stravaRefreshToken) {
        bree.config.shared.stravaRefreshToken = token_object.refresh_token;
    }

    const athletes = await getAthletesIds();

    for (const athleteId of athletes) {
        const response = await fetch(
            `${BASE_STRAVA_API_URL}/athletes/${athleteId}/activities?${new URLSearchParams({
                after: start.unix(),
            }).toString()}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token_object.access_token}`,
                },
            },
        );

        const activities = await response.json();
        const points = activities
            .map((activity) => {
                const date = moment.utc(activity.start_date_local).format('YYYY-MM-DD HH:00:00');
                return METRICS.map((metric) => ({
                    athleteId: athleteId,
                    id: metric.id,
                    value: metric.valueFn(activity).toFixed(2),
                    date,
                }));
            })
            .flat();

        if (points.length > 0) {
            await addPoints(points);
        }
    }
})();
