import { BaseDto } from './Shared.Types';
import { UserDto } from './User.Types';

export type StarProps = { stars: number };

export type RatingDto = BaseDto & {
	numberOfStars: number;
	comment?: string;
	user: UserDto;
};

export type RatingUpsertDto = BaseDto & {
	numberOfStars: number;
	comment?: string;
	userId: string;
	itemId?: string;
	restaurantId?: string;
};
