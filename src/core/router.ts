import { Hono } from "hono";

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
