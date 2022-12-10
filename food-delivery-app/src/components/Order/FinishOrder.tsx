import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	TextField,
	Typography
} from '@mui/material';
import { FC, ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from 'react-query';

import useLoggedInUser from '../../hooks/useLoggedInUser';
import useField from '../../hooks/useField';
import { ItemDto } from '../../types/Item.Types';
import { PaymentMethod } from '../../types/Payment.Types';
import {
	useGetAddresses,
	useGetCards,
	useGetVouchers,
	usePostOrder
} from '../../hooks/useApi';
import { useOrderState } from '../../hooks/useOrderState';

import OrderSummary from './OrderSummary';

type Props = {
	children: (open: () => void) => ReactNode;
	items?: ItemDto[];
	totalPrice: number;
	restaurantId: string;
};

const FinishOrder: FC<Props> = ({
	children,
	items,
	totalPrice,
	restaurantId
}) => {
	const user = useLoggedInUser();
	const navigate = useNavigate();
	const orderCall = usePostOrder(useQueryClient());

	// Open state
	const [open, setOpen] = useState(false);

	// Data
	const cardResult = useGetCards();
	const voucherResult = useGetVouchers();
	const addressResult = useGetAddresses();
	const cards = cardResult.data ? cardResult.data.data : undefined;
	const vouchers = voucherResult.data ? voucherResult.data.data : undefined;
	const addresses = addressResult.data ? addressResult.data.data : undefined;

	const [paymentMethod, setPaymentMethod] = useState(PaymentMethod.Cash);
	const [card, setCard] = useState('');
	const [voucher, setVoucher] = useState('');
	const [address, setAddress] = useState('');

	const [orderState] = useOrderState();

	// Fields
	const [note, noteProps] = useField('note', false);

	const [submitError, setSubmitError] = useState<string>();

	// Close and reset handler
	const closeDialog = () => {
		setOpen(false);
		noteProps.onChange({ target: { value: '' } } as never);
		setSubmitError(undefined);
	};

	// Submit handler
	const handleSubmit = async () => {
		if (!user?.id) {
			setSubmitError('You are not signed in');
			return;
		}

		try {
			if (
				!address ||
				address === '' ||
				(paymentMethod !== PaymentMethod.Cash &&
					(!card || card === '') &&
					(!voucher || voucher === ''))
			) {
				setSubmitError('Missing order information');
			} else {
				let paymentInfoId;
				if (paymentMethod === PaymentMethod.Cash) {
					paymentInfoId = undefined;
				} else if (paymentMethod === PaymentMethod.Card) {
					paymentInfoId = card;
				} else {
					paymentInfoId = voucher;
				}
				const orderId = await orderCall.mutateAsync({
					paymentMethod,
					addressId: address,
					note,
					orderItems: orderState,
					paymentInfoId,
					restaurantId,
					userId: user.id
				});
				navigate(`/orders/${orderId}`);
				closeDialog();
			}
		} catch (err) {
			setSubmitError(
				(err as { message?: string })?.message ?? 'Unknown error occurred'
			);
		}
	};

	const handleChange = (event: SelectChangeEvent) => {
		setPaymentMethod(event.target.value as PaymentMethod);
	};

	const handleChangeCard = (event: SelectChangeEvent) => {
		setCard(event.target.value);
	};

	const handleChangeVoucher = (event: SelectChangeEvent) => {
		setVoucher(event.target.value);
	};

	const handleChangeAddress = (event: SelectChangeEvent) => {
		setAddress(event.target.value);
	};

	return (
		<>
			{children(() => setOpen(true))}
			<Dialog open={open} onClose={closeDialog}>
				<DialogTitle>Finish the order</DialogTitle>
				<DialogContent
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: 2,
						minWidth: 500
					}}
				>
					<OrderSummary totalPrice={totalPrice} items={items} />
					<FormControl fullWidth>
						<InputLabel id="payment-method-label">Payment method</InputLabel>
						<Select
							labelId="payment-method-label"
							id="payment-method-select"
							value={paymentMethod.toString()}
							label="Payment method"
							onChange={handleChange}
						>
							{Object.values(PaymentMethod).map(value => (
								<MenuItem key={value} value={value}>
									{value}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					{paymentMethod === PaymentMethod.Card && (
						<FormControl fullWidth>
							<InputLabel id="card-info-label">Card information</InputLabel>
							<Select
								labelId="card-info-label"
								id="card-info-select"
								value={card}
								label="Card information"
								onChange={handleChangeCard}
							>
								{cards?.map(card => (
									<MenuItem key={card.id} value={card.id}>
										{`${card.number} --- ${new Date(
											card.expirationDate
										).toLocaleDateString()}`}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					)}
					{paymentMethod === PaymentMethod.Voucher && (
						<FormControl fullWidth>
							<InputLabel id="voucher-info-label">
								Voucher information
							</InputLabel>
							<Select
								labelId="voucher-info-label"
								id="v-info-select"
								value={voucher}
								label="Voucher information"
								onChange={handleChangeVoucher}
							>
								{vouchers?.map(voucher => (
									<MenuItem key={voucher.id} value={voucher.id}>
										{`${voucher.voucherNumber}`}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					)}
					<FormControl fullWidth>
						<InputLabel id="address-label">Address information</InputLabel>
						<Select
							labelId="address-info-label"
							id="address-select"
							value={address}
							label="Address information"
							onChange={handleChangeAddress}
						>
							{addresses?.map(a => (
								<MenuItem key={a.id} value={a.id}>
									{`${a.street} ${a.number} , ${a.town} ${a.zipCode}`}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<TextField label="Note" fullWidth {...noteProps} />
				</DialogContent>
				<DialogActions>
					{submitError && (
						<Typography
							variant="subtitle2"
							align="left"
							color="error"
							paragraph
						>
							{submitError}
						</Typography>
					)}
					<Button onClick={closeDialog}>Cancel</Button>
					<Button onClick={handleSubmit} variant="contained">
						Order now
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default FinishOrder;
