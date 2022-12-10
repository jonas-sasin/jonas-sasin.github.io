import { BaseDto, CategoryDto } from './Shared.Types';
import { RestaurantDto } from './Restaurant.Types';

export type ItemDto = BaseDto & {
	name: string;
	description?: string;
	price: number;
	averageRating: number;
	itemCategory?: CategoryDto;
	restaurant?: RestaurantDto;
};

export type ItemUpsertDto = BaseDto & {
	name: string;
	description?: string;
	price: number;
	itemCategoryId: string;
	restaurantId: string;
};
