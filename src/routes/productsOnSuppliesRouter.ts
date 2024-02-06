import { Hono } from "hono";
import { prisma } from "@/lib/prisma";
import { getProductsOnSupply, deleteProductOnSupply, insertProductsOnSupply, updateProductOnSupply } from "@/controllers/productsOnSuppliesController";
import { createSortMiddleware } from "@/middlewares/createSortMiddleware";
import { Prisma, ProductsOnSupply } from "@prisma/client";

export const productsOnSupplyRouter = new Hono();

// Get all products on a supply or get a product on a supply by id if the productId is provided in the query
productsOnSupplyRouter.get("/:supplyId", createSortMiddleware<Prisma.ProductsOnSupplyDelegate, ProductsOnSupply>(prisma.productsOnSupply, "productId"), getProductsOnSupply); // Require ProductID from the query
productsOnSupplyRouter.post("/:supplyId", insertProductsOnSupply);	// Require ProductID from the body
productsOnSupplyRouter.put("/:supplyId", updateProductOnSupply); // Require ProductID from the body

productsOnSupplyRouter.delete("/:supplyId", deleteProductOnSupply); // Require ProductID from the query


