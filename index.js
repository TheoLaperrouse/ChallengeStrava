import Bree from 'bree';
import Graceful from '@ladjs/graceful';

export const bree = new Bree({
    jobs: [
        {
            name: 'strava-activities',
            interval: 'every day',
        },
    ],
    shared: {
        stravaRefreshToken: process.env.STRAVA_REFRESH_TOKEN,
    },
});

const graceful = new Graceful({ brees: [bree] });
graceful.listen();

(async () => {
    await bree.start();
})();
