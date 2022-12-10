import { BaseDto } from './Shared.Types';

export type LoginDto = {
	phoneNumber: string;
	password: string;
};
export type UserDto = BaseDto & {
	id: string;
	firstName?: string;
	lastName?: string;
	phoneNumber: string;
	role: Role;
};

export type UserUpdateDto = BaseDto & {
	firstName: string;
	lastName: string;
	phoneNumber: string;
	role: number;
	password?: string;
};

export enum Role {
	User = 'User',
	Admin = 'Admin'
}
