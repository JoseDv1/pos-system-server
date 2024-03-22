import { type Context, Hono } from 'hono'

// Import Middlewares
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

// Import routes
import { handleError } from '@/errors/errors'
import { apiRoutes } from '@/routes/indexRoute'

// Start Hono
const app = new Hono()

// ---- Config ----
const port = 3000

// ---- Middlewares ----
app.use("*", cors())
app.use("*", logger())

// ---- Routes ----
app.route('/api', apiRoutes)


// Home Route
app.get('/', (ctx: Context) => {
  return ctx.text('Hello World!')
})

// 404 Routes
app.notFound((ctx: Context) => {
  return ctx.text(`404 Not found`, 404)
})

app.on(['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], '*', (ctx: Context) => {
  return ctx.text(`Method not allowed, ${ctx.req.url}`, 405)
})


// Error Handler
app.onError(handleError)

// ---- Server ----
console.log(`Server running on http://localhost:${port}`)

export default {
  port: port,
  fetch: app.fetch,
} 