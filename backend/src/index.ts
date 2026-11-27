import 'dotenv/config';
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import sql from './db'

import { setCookie } from 'hono/cookie';
import { randomBytes } from 'node:crypto';
import { verifyPassword } from './lib/password';

import { calculateStrengthLoad, calculateEnduranceLoad, validateEmailAddress, validatePassword } from '@kineLoad/shared';
import { hashPassword } from './lib/password';

// Constants
const port = Number(process.env.PORT || 8787)
const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME ?? 'kineload_session';
const SESSION_DAYS = 7;
const app = new Hono()

// Allow origin for frontend
app.use('/*', cors({
    origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173',
    credentials: true
}))

// Health route for test
app.get('/api/health', async (c) => {
    try {
        // test if database connection works
        const result = await sql`select current_timestamp as now`;

        // test calculations
        const strengthLoad = calculateStrengthLoad(2, 8, 3, 60);
        const enduranceLoad = calculateEnduranceLoad(9, 70);

        // validate email
        const emailValidation = validateEmailAddress('text@example.com')


        return c.json({
            status: 'ok',
            message: 'KineLoad APi is up!',
            database: 'connected',
            serverTime: result[0].now,
            testCalculations: {
                strengthLoad,
                enduranceLoad,
                totalLoad: strengthLoad + enduranceLoad
            },
            testValidation: emailValidation
        });
    } catch (error) {
        return c.json({
            status: 'error',
            message: 'Database connection error',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, 500);
    }
});

// register route/resource
app.post('/api/auth/register', async (c) => {
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
app.post('/api/auth/login', async (c) => {
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



console.log(`Server running on port ${port} ...`)
serve({ fetch: app.fetch, port })

