import fetch from 'node-fetch';

export const BASE_STRAVA_API_URL = 'https://www.strava.com/api/v3';

export async function refreshAccessToken(refresh_token) {
    const response = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST',
        body: new URLSearchParams({
            client_id: process.env.STRAVA_CLIENT_ID,
            client_secret: process.env.STRAVA_CLIENT_SECRET,
            refresh_token,
            grant_type: 'refresh_token',
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    return response.json();
}
