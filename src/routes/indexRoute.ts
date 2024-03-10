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

// Router
export const apiRoutes = new Hono()

// ----- Routes ----- 

// Categories
apiRoutes.route('/categories', categoriesRouter)

// Products
apiRoutes.route('/products', productsRouter)

// Providers 
apiRoutes.route('/providers', providerRouter)

// Clients
apiRoutes.route('/clients', clientsRouter)

// Sales
apiRoutes.route('/sales', salesRouter)

// Products on sale
apiRoutes.route('/sales/:saleId/products', productsOnSaleRouter)

// Supplies
apiRoutes.route('/supplies', suppliesRouter)

// Products on supply
apiRoutes.route('/supplies/:supplyId/products', productsOnSupplyRouter) 
