import 'dotenv/config';
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import sql from './db'

import { calculateStrengthLoad, calculateEnduranceLoad, validateEmailAddress } from '@kineLoad/shared';

// Constants
const port = Number(process.env.PORT || 8787)

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
})

console.log(`Server running on port ${port} ...`)
serve({ fetch: app.fetch, port })

