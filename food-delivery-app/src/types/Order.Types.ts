import { BaseDto } from './Shared.Types';
import { ItemDto } from './Item.Types';
import { PaymentInfoDto, PaymentMethod } from './Payment.Types';
import { UserDto } from './User.Types';
import { RestaurantDto } from './Restaurant.Types';
import { AddressDto } from './Address.Types';

export type OrderItemUpsertDto = BaseDto & {
	amount: number;
	orderId?: string;
	itemId: string;
};

export type OrderItemDto = BaseDto & {
	amount: number;
	order: OrderDto;
	item: ItemDto;
};

export type OrderUpsertDto = BaseDto & {
	paymentMethod: PaymentMethod;
	note?: string;
	userId: string;
	addressId: string;
	paymentInfoId?: string;
	restaurantId: string;
	orderItems: OrderItemUpsertDto[];
};

export type OrderDto = BaseDto & {
	paymentMethod?: PaymentMethod;
	note?: string;
	dateTimeOffset: Date;
	price: number;
	user?: UserDto;
	address?: AddressDto;
	paymentInfo?: PaymentInfoDto;
	restaurant: RestaurantDto;
	orderItems?: OrderItemDto[];
};
