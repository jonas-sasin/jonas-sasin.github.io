import { BaseDto } from './Shared.Types';

export type AddressDto = BaseDto & {
	id: string;
	street: string;
	number: number;
	zipCode: number;
	town: string;
	flatNumber?: number;
	note?: string;
};

export type AddressUpsertDto = BaseDto & {
	street: string;
	number: number;
	zipCode: number;
	town: string;
	flatNumber?: number;
	note?: string;
	userId: number;
};

export type MyAddressesProps = {
	userId: string;
};

export type AddressDialogProps = {
	userId: string;
	address: AddressDto | undefined;
	addressDialogOpened: boolean;
	handleCloseAddressDialog: () => void;
	updateAddress: (address: AddressUpsertDto) => void;
	createAddress: (address: AddressUpsertDto) => void;
};
