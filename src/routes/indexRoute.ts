import { Hono } from "hono";

// Import routes
import { categoriesRouter } from '@/routes/categoriesRoutes'
import { productsRouter } from '@/routes/productsRouter'
import { providerRouter } from '@/routes/providersRouter'
import { clientsRouter } from '@/routes/clientsRouter'
import { salesRouter } from "@/routes/salesRouter"
import { suppliesRouter } from '@/routes/suppliesRouter'
import { productsOnSupplyRouter } from '@/routes/productsOnSuppliesRouter'
import { productsOnSaleRouter } from '@/routes/productsOnSaleRouter'


export const apiRoutes = new Hono()

apiRoutes.route('/categories', categoriesRouter)
apiRoutes.route('/products', productsRouter)
apiRoutes.route('/providers', providerRouter)
apiRoutes.route('/clients', clientsRouter)

// Products on sale routes
apiRoutes.route('/sales', salesRouter)
apiRoutes.route('/sale', productsOnSaleRouter)

// Supply routes
apiRoutes.route('/supplies', suppliesRouter)
apiRoutes.route('/supply', productsOnSupplyRouter)
