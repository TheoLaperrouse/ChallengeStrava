import moment from 'moment';
import { BASE_STRAVA_API_URL, CLUB_ID, refreshAccessToken } from './utils/strava.js';
import { addPoints, getAthletesIds } from './utils/pg-connection.js';
import { bree } from '../index.js';

const processActivities = (activities, athleteIds, sportTypes) => {
    return activities
        .map((activity) => {
            const { firstname, lastname } = activity.athlete;
            const fullName = `${firstname} ${lastname}`;

            if (athleteIds.includes(fullName) && sportTypes.includes(activity.sport_type)) {
                return {
                    athleteId: fullName,
                    distance_run: (activity.distance / 1000).toFixed(2),
                    time_run: (activity.moving_time / 60).toFixed(2),
                    speed_run: ((activity.distance / activity.moving_time) * 3.6).toFixed(2),
                    elevation_gain: activity.total_elevation_gain,
                    date: moment().format('YYYY-MM-DD HH:00:00'),
                };
            }
            return null;
        })
        .filter((activity) => activity !== null);
};

(async () => {
    const athleteIds = await getAthletesIds();
    const token_object = await refreshAccessToken(bree.config.shared.stravaRefreshToken);

    if (token_object.refresh_token !== bree.config.shared.stravaRefreshToken) {
        bree.config.shared.stravaRefreshToken = token_object.refresh_token;
    }

    const response = await fetch(`${BASE_STRAVA_API_URL}/clubs/${CLUB_ID}/activities?per_page=100`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token_object.access_token}`,
        },
    });

    const activities = await response.json();
    const index = activities.findIndex((activity) => activity.distance === 5010.4);
    const filteredActivities = index !== -1 ? activities.slice(0, index) : activities;

    const runActivities = processActivities(filteredActivities, athleteIds, ['Run', 'TrailRun']);

    const bikeActivities = processActivities(filteredActivities, athleteIds, ['Ride']);

    if (runActivities.length > 0) {
        await addPoints(runActivities, 'run');
    }
    if (bikeActivities.length > 0) {
        await addPoints(bikeActivities, 'bike');
    }

    bree.stop();
})();
