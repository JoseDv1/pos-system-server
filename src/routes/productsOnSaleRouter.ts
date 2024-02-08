import { Hono } from "hono";
import { getProductsOnSale, getProductOnSale, postProductsOnSale, putProductOnSale, deleteProductOnSale } from "@/controllers/productsOnSaleController";

export const productsOnSaleRouter = new Hono();

productsOnSaleRouter.get("/", getProductsOnSale);
productsOnSaleRouter.get("/:productId", getProductOnSale);
productsOnSaleRouter.post("/", postProductsOnSale);
productsOnSaleRouter.put("/:productId", putProductOnSale);
productsOnSaleRouter.delete("/:productId", deleteProductOnSale);



