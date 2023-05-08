import moment from 'moment';
import fetch from 'node-fetch';
import { BASE_STRAVA_API_URL, refreshAccessToken } from './utils/strava.js';
import { bree } from '../index.js';

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const ATHLETE_ID = 70861920;

const DATA = [
    {
        name: 'distance_run_energiency',
        valueFn: (activity) => activity.distance / 1000,
    },
    {
        name: 'time_run_energiency',
        valueFn: (activity) => activity.moving_time,
    },
    {
        name: 'speed_run_energiency',
        valueFn: (activity) => (activity.distance / activity.moving_time) * 3.6,
    },
];

(async () => {
    const start = moment().subtract(1, 'days');
    const end = moment().format(DATE_FORMAT);

    console.log(`Starting import from ${start.format(DATE_FORMAT)} to ${end}`);

    const token_object = await refreshAccessToken(bree.config.shared.stravaRefreshToken);

    if (token_object.refresh_token !== bree.config.shared.stravaRefreshToken) {
        bree.config.shared.stravaRefreshToken = token_object.refresh_token;
    }

    const response = await fetch(
        `${BASE_STRAVA_API_URL}/athletes/${ATHLETE_ID}/activities?${new URLSearchParams({
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
            return DATA.map((meter) => ({ athleteId: ATHLETE_ID , name: meter.name, value: meter.valueFn(activity), date }));
        })
        .flat();

    console.log(points);
})();
