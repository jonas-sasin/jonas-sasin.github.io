import { BaseDto } from './Shared.Types';
import { UserDto } from './User.Types';

export type CardCreateDto = PaymentInfoDto & {
	ownerName: string;
	number: string;
	expirationDate: Date;
	cvcCode: number;
};

export type CardDto = PaymentInfoDto & {
	id: string;
	ownerName: string;
	number: string;
	expirationDate: Date;
	deleted: boolean;
};

export type VoucherDto = PaymentInfoDto & {
	id: string;
	voucherNumber: string;
};

export type PaymentInfoDto = BaseDto & {
	user: UserDto;
};

export enum PaymentMethod {
	Card = 'Card',
	Voucher = 'Voucher',
	Cash = 'Cash'
}

export type MyCardsProps = {
	userId: string;
	user: UserDto;
};

export type MyVouchersProps = {
	userId: string;
	user: UserDto;
};

export type CardDialogProps = {
	userId: string;
	user: UserDto;
	cardDialogOpened: boolean;
	handleCloseCardDialog: () => void;
	createCard: (e: CardCreateDto) => void;
};

export type VoucherDialogProps = {
	userId: string;
	user: UserDto;
	voucherDialogOpened: boolean;
	handleCloseVoucherDialog: () => void;
	createVoucher: (e: VoucherDto) => void;
};
