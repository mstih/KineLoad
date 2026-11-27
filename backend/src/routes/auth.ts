import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { randomBytes } from "crypto";

import { validateEmailAddress, validatePassword } from '@kineload/shared';
import sql from '../db.js';
import { hashPassword, verifyPassword } from "../lib/password";

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME ?? 'kineload_session';
const SESSION_DAYS = 7;

const auth = new Hono();

// register route/resource
auth.post('/register', async (c) => {
    const body = await c.req.json().catch(() => null);
    if (!body) {
        return c.json({ error: 'Invalid request!' }, 400);
    }

    const name = String(body.name ?? '').trim();
    const email = String(body.email ?? '').trim();
    const password = String(body.password ?? '');

    // variable to store error rows
    const details: Record<string, string> = {};

    // validate name
    if (name === '') {
        details.name = 'Name required!';
    }

    // validate email
    const emailCheck = validateEmailAddress(email);
    if (!emailCheck.valid) {
        details.email = emailCheck.errors[0]
    }

    // validate password
    const passCheck = validatePassword(password);
    if (!passCheck.valid) {
        details.password = passCheck.errors[0];
    }

    // if there is more than one row in details
    if (Object.keys(details).length > 0) {
        return c.json({ error: 'Invalid input', details }, 400);
    }

    // Checks if the user exists in the database
    // 409 - status code for conflict with current state of target resource (duplicate records, mismatches...)
    const exists = await sql`select id from users where email = ${email}`;
    if (exists.length > 0) {
        return c.json({ error: 'Email already registered.' }, 409);
    }

    const passwordHash = await hashPassword(password);

    // Insert user into database
    const [user] = await sql`
        insert into users (name, email, password_hash)
        values (${name}, ${email}, ${passwordHash})
        returning id, name, email
    `;

    return c.json({ user }, 201)

});

// login route/resource
auth.post('/login', async (c) => {
    const body = await c.req.json().catch(() => null);
    if (!body) {
        return c.json({ error: 'Invalid request!' }, 400);
    }

    const email = String(body.email ?? '').trim().toLowerCase();
    const password = String(body.password ?? '');

    const details: Record<string, string> = {};
    if (email === '') details.email = 'Email required!';
    if (password === '') details.password = 'Password required!';

    if (Object.keys(details).length > 0) {
        return c.json({ error: 'Invalid input', details }, 400);
    }

    const [user] = await sql`
        select id, name, email, password_hash
        from users
        where email = ${email}
    `;

    if (!user || !(await verifyPassword(password, user.password_hash))) {
        return c.json({ error: 'Invalid email or password' }, 401);
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000); // to 7 days

    await sql`
        insert into sessions (user_id, token, expires_at)
        values (${user.id}, ${token}, ${expiresAt})
    `;

    setCookie(c, SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        path: '/',
        expires: expiresAt
    });

    return c.json({ user: { id: user.id, name: user.name, email: user.email } });

})

export default auth;