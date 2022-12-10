import { BaseDto, CategoryDto } from './Shared.Types';
import { AddressDto } from './Address.Types';

export type RestaurantDto = BaseDto & {
	name: string;
	description?: string;
	averageRating: number;
	address?: AddressDto;
	restaurantCategory: CategoryDto;
};

export type RestaurantUpsertDto = BaseDto & {
	name: string;
	description?: string;
	averageRating?: number;
	addressId: string;
	restaurantCategoryId: string;
};

export type RestaurantsQueryParams = {
	categoryId?: string;
	minAvgRating?: string;
	page?: string;
	pageSize?: string;
};
