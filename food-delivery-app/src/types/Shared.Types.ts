export type BaseDto = {
	id?: string;
};

export type CategoryDto = BaseDto & {
	name: string;
	description?: string;
};

export type CategoryUpsertDto = {
	name: string;
	description?: string;
};
