import { ErrorBadRequest, ErrorNotFound } from "@/utils/errors";
import { prisma } from "@/utils/prisma";
import { Provider } from "@prisma/client";

export const findProviders = async () => {
	const providers: Provider[] = await prisma.provider.findMany({
		include: {
			supplies: true
		},
	});

	if (!providers) {
		throw new ErrorNotFound("No providers found");
	}

	return providers;
};
export const findProviderById = async (id: string) => {
	const provider = await prisma.provider.findUnique({
		where: {
			id
		},
		include: {
			supplies: true
		},
	});

	if (!provider) {
		throw new ErrorNotFound("Provider not found");
	}

	return provider;
};

export const insertProvider = async (data: Omit<Provider, "id">) => {
	// Validate the data
	if (!data.phone || !data.name || !data.supplyDays) {
		throw new ErrorBadRequest("Phone, name and supplyDays are required");
	}
	const createdProvider = await prisma.provider.create({
		data
	});

	return createdProvider;
};
export const updateProviderService = async (id: string, data: Partial<Omit<Provider, "id">>) => {

	// Validate if almost one field is provided
	if (!data.phone && !data.name && !data.supplyDays) {
		throw new ErrorBadRequest("At least one field is required");
	}
	// Update the provider
	const updatedProvider = await prisma.provider.update({
		where: {
			id: id,
		},
		data,
	});

	return updatedProvider;
};
export const deleteProviderService = async (id: string) => {

	// Delete the provider
	const deletedProvider = await prisma.provider.delete({
		where: {
			id,
		},
	});

	return deletedProvider;
};