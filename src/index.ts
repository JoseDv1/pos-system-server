import { serve } from '@hono/node-server'
import { type Context, Hono } from 'hono'

// Import Middlewares
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

// Import routes
import { categoriesRouter } from '@/routes/categoriesRoutes'
import { productsRouter } from '@/routes/productsRouter'
import { providerRouter } from '@/routes/providersRouter'
import { clientsRouter } from '@/routes/clientsRouter'
import { salesRouter } from "@/routes/salesRouter"
import { suppliesRouter } from '@/routes/suppliesRouter'


const app = new Hono()
const apiRoutes = new Hono()

// ---- Config ----
const port = 3000

// ---- Middlewares ----
app.use(cors())
app.use(logger())

// ---- Routes ----
apiRoutes.route('/categories', categoriesRouter)
apiRoutes.route('/products', productsRouter)
apiRoutes.route('/providers', providerRouter)
apiRoutes.route('/clients', clientsRouter)
apiRoutes.route('/sales', salesRouter)
apiRoutes.route('/supplies', suppliesRouter)
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
  return ctx.text('Method not allowed', 405)
})



// ---- Server ----
console.log(`Server running on http://localhost:${port}`)


serve(
  {
    fetch: app.fetch,
    port,
  }
)
