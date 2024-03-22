import { Hono } from "hono";

// Import routes
import { categoriesRouter } from '@/lib/Categories/categoriesRoutes'
import { clientsRouter } from '@/lib/Clients/clientsRouter'
import { productsRouter } from '@/lib/Products/productsRouter'
import { productsOnSaleRouter } from '@/lib/ProductsOnSale/productsOnSaleRouter'
import { productsOnSupplyRouter } from '@/lib/ProductsOnSupplies/productsOnSuppliesRouter'
import { providerRouter } from '@/lib/Providers/providersRouter'
import { salesRouter } from "@/lib/Sales/salesRouter"
import { suppliesRouter } from '@/lib/Supplies/suppliesRouter'



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
