import { AddressUpsertDto } from '../types/Address.Types';
import { CardCreateDto, VoucherDto } from '../types/Payment.Types';
import { UserUpdateDto } from '../types/User.Types';

const validateFirstName = (firstName: string): boolean => !firstName?.trim();

const validateLastName = (lastName: string): boolean => !lastName?.trim();

const validatePhoneNumber = (phoneNumber: string): boolean =>
	phoneNumber?.length !== 9 && !!phoneNumber.match(/^[\d]*$/);

const validatePassword = (password: string | undefined): boolean => {
	if (password === undefined) {
		return false;
	}
	return password.length === 0 || !!password.match(/[\s]/);
};

const validateVoucherNumber = (voucherNumber: string): boolean =>
	voucherNumber?.length !== 9;

const validateOwnerName = (ownerName: string): boolean => !ownerName?.trim();

const validateExpirationDate = (expirationDate: Date): boolean => {
	if (expirationDate === undefined || new Date(expirationDate) <= new Date()) {
		return true;
	}
	return false;
};

const validateCardNumber = (cardNumber: string): boolean =>
	cardNumber?.length !== 16;

const validateCvcCode = (cvcCode: number): boolean =>
	cvcCode?.toString().length !== 3;

const validateStreetName = (streetName: string): boolean =>
	streetName === undefined || !streetName.trim();

const validateStreetNumber = (streetNumber: number): boolean =>
	streetNumber === undefined;

const validateZipCode = (zipCode: number): boolean => zipCode === undefined;

const validateTownName = (townName: string): boolean =>
	townName === undefined || !townName?.trim();

type cardValidatorErrors = {
	ownerName: boolean;
	number: boolean;
	expirationDate: boolean;
	cvcCode: boolean;
};

export const cardValidator = (values: CardCreateDto) => {
	const errors = {} as cardValidatorErrors;
	errors.ownerName = validateOwnerName(values.ownerName);
	errors.number = validateCardNumber(values.number);
	errors.expirationDate = validateExpirationDate(values.expirationDate);
	errors.cvcCode = validateCvcCode(values.cvcCode);

	if (
		errors.ownerName ||
		errors.number ||
		errors.expirationDate ||
		errors.cvcCode
	) {
		return errors;
	}
	return undefined;
};

type addressVlidatorErrors = {
	street: boolean;
	number: boolean;
	zipCode: boolean;
	town: boolean;
};

export const addressVlidator = (values: AddressUpsertDto) => {
	const errors = {} as addressVlidatorErrors;
	errors.street = validateStreetName(values.street);
	errors.number = validateStreetNumber(values.number);
	errors.zipCode = validateZipCode(values.zipCode);
	errors.town = validateTownName(values.town);

	if (errors.street || errors.number || errors.zipCode || errors.town) {
		return errors;
	}
	return undefined;
};

type userUpdateValidatorErrors = {
	firstName: boolean;
	lastName: boolean;
	phoneNumber: boolean;
	password: boolean;
};

export const userUpdateValidator = (values: UserUpdateDto) => {
	const errors = {} as userUpdateValidatorErrors;
	errors.firstName = validateFirstName(values.firstName);
	errors.lastName = validateLastName(values.lastName);
	errors.phoneNumber = validatePhoneNumber(values.phoneNumber);
	errors.password = validatePassword(values.password);

	if (
		errors.firstName ||
		errors.lastName ||
		errors.phoneNumber ||
		errors.password
	) {
		return errors;
	}
	return undefined;
};

type voucherValidatorErrors = {
	voucherNumber: boolean;
};

export const voucherValidator = (values: VoucherDto) => {
	const errors = {} as voucherValidatorErrors;
	errors.voucherNumber = validateVoucherNumber(values.voucherNumber);

	if (errors.voucherNumber) {
		return errors;
	}
	return undefined;
};
