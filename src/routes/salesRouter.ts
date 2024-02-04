import { Hono } from "hono";
import { prisma } from "@/lib/prisma";
import { createSale, deleteSale, getSaleById, getSales, updateSale } from "@/controllers/salesController"
import { createSortMiddleware } from "@/middlewares/createSortMiddleware";
import type { Prisma, Sale } from "@prisma/client";

export const salesRouter = new Hono();
salesRouter.get("/", createSortMiddleware<Prisma.SaleDelegate, Sale>(prisma.sale, "createdAt"), getSales);
salesRouter.get("/:id", getSaleById);
salesRouter.post("/", createSale);
salesRouter.put("/:id", updateSale);
salesRouter.delete("/:id", deleteSale);

