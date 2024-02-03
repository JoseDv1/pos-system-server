import { serve } from '@hono/node-server'
import { type Context, Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { usersRouter } from './routes/users'


const app = new Hono()
const apiRoutes = new Hono()

// ---- Config ----
const port = 3000

// ---- Middlewares ----
app.use(cors())
app.use(logger())

// ---- Routes ----
apiRoutes.route('/users', usersRouter)
app.route('/api', apiRoutes)


// Home Route
app.get('/', (ctx: Context) => {
  return ctx.text('Hello World!')
})


// 404 Routes
app.get('*', (ctx: Context) => {
  const { method, path } = ctx.req
  return ctx.text(`Cannot ${method} ${path} 404 Not found `, 404)
})

app.on(['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], '*', (ctx: Context) => {
  return ctx.text('Method not allowed', 405)
})



// ---- Server ----
serve(
  {
    fetch: app.fetch,
    port,
  }
)
