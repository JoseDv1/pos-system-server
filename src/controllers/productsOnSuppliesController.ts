
import { prisma } from "@/lib/prisma";
import { Context, Next } from "hono";
import { ProductsOnSupply } from "@prisma/client";
import { findProductsOnSupply } from "@/services/productsOnSupplyServices";

// Get Controllers
export async function getProductsOnSupply(ctx: Context, next: Next) {
	const { supplyId } = ctx.req.param();

	// Get all products on the supply
	const productsOnSupply = await findProductsOnSupply(supplyId);
	return ctx.json(productsOnSupply);

}

export async function getProductsOnSupplyById(ctx: Context) {

	console.log("getProductsOnSupplyById");

	const { supplyId } = ctx.req.param();
	const { productId } = ctx.req.query();

	// Validate if the supply exists
	const supply = await prisma.supply.findUnique({
		where: { id: supplyId }
	});

	if (!supply) {
		return ctx.json({ error: "Supply not found" }, 404);
	}

	// Validate if the product exists
	const product = await prisma.product.findUnique({
		where: { id: productId }
	});

	if (!product) {
		return ctx.json({ error: "Product not found" }, 404);
	}

	// Get the product on the supply
	const productOnSupply = await prisma.productsOnSupply.findFirst({
		where: {
			productId,
			supplyId
		},
		include: {
			product: true
		}
	});

	return ctx.json(productOnSupply);
}

// Insert Controllers
export async function insertProductsOnSupply(ctx: Context) {
	const { supplyId } = ctx.req.param();
	const body: ProductsOnSupply | ProductsOnSupply[] = await ctx.req.json();

	if (Array.isArray(body)) {
		return insertMultipleProductsOnSupply(ctx);
	}

	const { productId, quantity, unitCost } = body;

	// Check if the supply and product exists
	const [supply, product] = await prisma.$transaction([
		prisma.supply.findUnique({
			where: { id: supplyId }
		}),
		prisma.product.findUnique({
			where: { id: productId }
		})
	]);
	if (!supply) {
		return ctx.json({ error: "Supply not found" }, 404);
	}
	if (!product) {
		return ctx.json({ error: "Product not found" }, 404);
	}

	// Check if the product is already on the supply
	const productOnSupplyExists = await prisma.productsOnSupply.findFirst({
		where: {
			productId: productId,
			supplyId: supplyId
		}
	});

	if (productOnSupplyExists) {
		return ctx.json({ error: "Product already on the supply" }, 400);
	}


	// Check if the quantity is greater than 0
	if (quantity <= 0) {
		return ctx.json({ error: "Quantity must be greater than 0" }, 400);
	}

	// Check if the unit cost is greater than 0
	if (unitCost <= 0) {
		return ctx.json({ error: "Unit cost must be greater than 0" }, 400);
	}


	// Insert the product on the supply
	const productOnSupply = await prisma.productsOnSupply.create({
		data: {
			productId,
			supplyId,
			quantity,
			unitCost
		}
	});


	// Update the total cost of the supply
	await prisma.supply.update({
		where: { id: supplyId },
		data: {
			totalCost: supply.totalCost + (quantity * unitCost)
		}
	});




	// Return the product that was inserted on the supply
	return ctx.json(productOnSupply);

}

export async function insertMultipleProductsOnSupply(ctx: Context) {
	const { supplyId } = ctx.req.param();
	const body: ProductsOnSupply[] = await ctx.req.json();

	// Check if the supply exists
	const supply = await prisma.supply.findUnique({
		where: { id: supplyId }
	});
	if (!supply) {
		return ctx.json({ error: "Supply not found" }, 404);
	}

	// Check if the products exists
	body.forEach(async (productOnSupply) => {
		const product = await prisma.product.findUnique({
			where: { id: productOnSupply.productId }
		});
		if (!product) {
			return ctx.json({ error: "Product not found" }, 404);
		}
	});

	// Insert the products on the supply and return the products that were inserted
	const productsOnSupply = await prisma.productsOnSupply.createMany({
		data: body.map((productOnSupply) => {
			return {
				supplyId: supplyId,
				productId: productOnSupply.productId,
				quantity: productOnSupply.quantity,
				unitCost: productOnSupply.unitCost
			};
		})
	});

	// Update the total cost of the supply
	const totalCost = body.reduce((acc, productOnSupply) => {
		return acc + (productOnSupply.quantity * productOnSupply.unitCost);
	}, 0);

	await prisma.supply.update({
		where: { id: supplyId },
		data: {
			totalCost: supply.totalCost + totalCost
		}
	});

	// Return the products that were inserted on the supply
	return ctx.json(productsOnSupply);




}

// Update Controllers
export async function updateProductOnSupply(ctx: Context) {

	const { supplyId } = ctx.req.param();
	const body: ProductsOnSupply = await ctx.req.json();
	const { productId, quantity, unitCost } = body;

	// Check if the fields are valid
	if (quantity <= 0) {
		return ctx.json({ error: "Quantity must be greater than 0" }, 400);
	}

	if (unitCost <= 0) {
		return ctx.json({ error: "Unit cost must be greater than 0" }, 400);
	}


	// Check if the record exists
	const OldproductOnSupply = await prisma.productsOnSupply.findFirst({
		where: {
			productId,
			supplyId
		},
		include: {
			supply: true
		}
	});

	if (!OldproductOnSupply) {
		return ctx.json({ error: "Product on supply not found" }, 404);
	}

	// Update the product on the supply
	const updatedProductOnSupply = await prisma.productsOnSupply.update({
		where: {
			productId_supplyId: {
				productId,
				supplyId
			}
		},
		data: {
			quantity,
			unitCost
		}
	});


	const newTotalCost = quantity * unitCost;
	// Update the total cost of the supply
	const diference = newTotalCost - OldproductOnSupply.supply.totalCost;

	await prisma.supply.update({
		where: { id: supplyId },
		data: {
			totalCost: OldproductOnSupply.supply.totalCost + diference
		}
	});


	return ctx.json(updatedProductOnSupply);
}

// Delete Controllers
export async function deleteProductOnSupply(ctx: Context) {
	const { supplyId } = ctx.req.param();
	const { productId } = ctx.req.query();

	// Check if the product on the supply exists
	const productOnSupply = await prisma.productsOnSupply.findFirst({
		where: {
			productId,
			supplyId
		},
		include: {
			supply: true
		}
	});

	if (!productOnSupply) {
		return ctx.json({ error: "Product on supply not found" }, 404);
	}

	// Delete the product on the supply
	const deletedProductOnSupply = await prisma.productsOnSupply.delete({
		where: {
			productId_supplyId: {
				productId,
				supplyId
			}
		}
	});

	// Update the total cost of the supply
	await prisma.supply.update({
		where: { id: supplyId },
		data: {
			totalCost: {
				decrement: deletedProductOnSupply.quantity * deletedProductOnSupply.unitCost
			}
		}
	});

	return ctx.json(deletedProductOnSupply);
}




