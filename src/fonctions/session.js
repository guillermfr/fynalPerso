import cookie from 'cookie';
import {SESSION_NAME} from "@/const";

// Set the name of the cookie used for session management

// Function to get the session data from the cookie
export const getSession = (req) => {
    const cookies = cookie.parse(req.headers.cookie || '');
    const sessionCookie = cookies[SESSION_NAME];
    if (!sessionCookie) {
        return null;
    }
    try {
        return JSON.parse(sessionCookie);
    } catch (err) {
        console.error(`Error parsing session cookie: ${err}`);
        return null;
    }
};

// Function to set the session data in a cookie
export const setSession = (res, sessionData) => {
    const sessionCookie = cookie.serialize(SESSION_NAME, JSON.stringify(sessionData), {
        maxAge: 60 * 60 * 24 * 7, // 1 week
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
    });
    res.setHeader('Set-Cookie', sessionCookie);
};

// Function to clear the session cookie
export const clearSession = (res) => {
    const sessionCookie = cookie.serialize(SESSION_NAME, '', {
        maxAge: -1,
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
    });
    res.setHeader('Set-Cookie', sessionCookie);
};