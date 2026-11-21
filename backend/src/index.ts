import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

// Constants
const port = 8787

const app = new Hono()

// Allow origin for frontend
app.use('/*', cors({ origin: ['http://localhost:5173'] }))

// Health route for test
app.get('/api/health', (c) => {
    return c.json({ status: 'ok', message: 'KineLoad API is UP!' })
})

console.log(`Server running on port ${port}`)
serve({ fetch: app.fetch, port })

