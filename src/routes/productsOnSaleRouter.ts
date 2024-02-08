import { Hono } from "hono";
import { getProductsOnSale, getProductOnSale, postProductsOnSale, putProductOnSale, deleteProductOnSale } from "@/controllers/productsOnSaleController";

export const productsOnSaleRouter = new Hono();

productsOnSaleRouter.get("/:saleId", getProductsOnSale);
productsOnSaleRouter.get("/:saleId/products/:productId", getProductOnSale);
productsOnSaleRouter.post("/:saleId", postProductsOnSale);
productsOnSaleRouter.put("/:saleId/products/:productId", putProductOnSale);
productsOnSaleRouter.delete("/:saleId/products/:productId", deleteProductOnSale);



