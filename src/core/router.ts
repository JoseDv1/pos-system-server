import { Hono } from "hono";
import { execSync } from 'child_process'

// Import routes
import { categoriesRouter } from '@/core/Categories/categoriesRoutes'
import { clientsRouter } from '@/core/Clients/clientsRouter'
import { productsRouter } from '@/core/Products/productsRouter'
import { productsOnSaleRouter } from '@/core/ProductsOnSale/productsOnSaleRouter'
import { productsOnSupplyRouter } from '@/core/ProductsOnSupplies/productsOnSuppliesRouter'
import { providerRouter } from '@/core/Providers/providersRouter'
import { salesRouter } from "@/core/Sales/salesRouter"
import { suppliesRouter } from '@/core/Supplies/suppliesRouter'



// Router
export const apiRoutes = new Hono()

// ----- Routes ----- 
apiRoutes.route('/categories', categoriesRouter)
apiRoutes.route('/products', productsRouter)
apiRoutes.route('/providers', providerRouter)
apiRoutes.route('/clients', clientsRouter)
apiRoutes.route('/sales', salesRouter)
apiRoutes.route('/sales/:saleId/products', productsOnSaleRouter)
apiRoutes.route('/supplies', suppliesRouter)
apiRoutes.route('/supplies/:supplyId/products', productsOnSupplyRouter)

// Utils 
apiRoutes.get('/version', (ctx) => {
	execSync("git config --global --add safe.directory /usr/src/app")
	const version = execSync("git rev-parse HEAD").toString()
	return ctx.text(version)
})