import 'dotenv/config';
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import sql from './db'

// Constants
const port = 8787

const app = new Hono()

// Allow origin for frontend
app.use('/*', cors({ origin: ['http://localhost:5173'] }))

// Health route for test
app.get('/api/health', async (c) => {
    try {
        // test if database connection works
        const result = await sql`select current_timestamp as now`;
        return c.json({
            status: 'ok',
            message: 'KineLoad APi is up!',
            database: 'connected',
            serverTime: result[0].now
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

