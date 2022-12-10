import { FC, useCallback, useMemo } from 'react';
import {
	Box,
	Button,
	Card,
	CardContent,
	Grid,
	Typography
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import ReviewStars from '../Shared/ReviewStars';
import { ItemDto } from '../../types/Item.Types';
import { useOrderState } from '../../hooks/useOrderState';
import { OrderItemUpsertDto } from '../../types/Order.Types';
import useLoggedInUser from '../../hooks/useLoggedInUser';
import { Role } from '../../types/User.Types';
import AddReview from '../Review/AddReview';
import ConfirmDeleteDialog from '../Shared/ConfirmDeleteDialog';

import UpsertItem from './UpsertItem';

type ItemPreviewProps = ItemDto & {
	onDelete: () => void;
	restId?: string;
};

const ItemPreview: FC<ItemPreviewProps> = ({
	id,
	name,
	description,
	price,
	averageRating,
	onDelete,
	restId
}) => {
	const [orderState, setOrderState] = useOrderState();
	const user = useLoggedInUser();
	const navigate = useNavigate();

	const addOrderItems = useCallback(
		(id?: string) => {
			const orderStateTmp = [...orderState];
			const orderItem = orderState.find(o => o.itemId === id);
			if (orderItem) {
				orderItem.amount += 1;
				const newArray = orderStateTmp.filter(i => i.itemId !== id);
				newArray.push(orderItem);
				setOrderState(newArray);
			} else {
				if (id) {
					const newItem: OrderItemUpsertDto = { itemId: id, amount: 1 };
					orderStateTmp.push(newItem);
					setOrderState(orderStateTmp);
				}
			}
		},
		[orderState]
	);
	const removeOrderItems = useCallback(
		(id?: string) => {
			const orderStateTmp = [...orderState];
			const orderItem = orderState.find(o => o.itemId === id);
			if (orderItem) {
				if (orderItem.amount === 0) {
					const newArray = orderStateTmp.filter(i => i.itemId !== id);
					setOrderState(newArray);
				} else {
					orderItem.amount -= 1;
					const newArray = orderStateTmp.filter(i => i.itemId !== id);
					newArray.push(orderItem);
					setOrderState(newArray);
				}
			}
		},
		[orderState]
	);

	const amount = useMemo((): number => {
		const orderItem = orderState.find(o => o.itemId === id);
		if (orderItem) {
			return orderItem.amount;
		}
		return 0;
	}, [orderState]);

	return (
		<Box sx={{ width: 1 }}>
			<Card
				sx={{
					width: 1,
					textAlign: 'left'
				}}
			>
				<CardContent>
					<Typography variant="h6" color="textSecondary">
						{name}
					</Typography>
					<Typography color="textSecondary">{description}</Typography>

					<Typography variant="h6" textAlign="center">
						{price} $
					</Typography>
					<ReviewStars stars={averageRating} />
				</CardContent>
				{user?.role !== Role.Admin ? (
					<Grid container>
						<Grid item xs={3}>
							<Button onClick={() => removeOrderItems(id)}>-</Button>
							<Button onClick={() => addOrderItems(id)}>+</Button>
						</Grid>
						<Grid item xs={1}>
							<Card sx={{ backgroundColor: 'grey', textAlign: 'center' }}>
								<Box>{amount}</Box>
							</Card>
						</Grid>
						<Grid item xs={4} />
						<Grid item container xs={4} justifyContent="flex-end" spacing={1}>
							<Grid item>
								<AddReview itemId={id}>
									{open => (
										<Button
											onClick={open}
											variant="contained"
											sx={{ backgroundColor: 'grey' }}
										>
											+ review
										</Button>
									)}
								</AddReview>
							</Grid>
							<Grid item>
								<Button
									variant="contained"
									sx={{ backgroundColor: 'grey' }}
									onClick={() => navigate(`/reviews/item/${id}`)}
								>
									See reviews
								</Button>
							</Grid>
						</Grid>
					</Grid>
				) : (
					<Grid item container xs={12}>
						<Grid item container xs={3} spacing={1}>
							<Grid item>
								<UpsertItem restId={restId ?? ''} itemId={id}>
									{open => (
										<Button onClick={open} variant="contained">
											<Edit />
										</Button>
									)}
								</UpsertItem>
							</Grid>
							<Grid item>
								<ConfirmDeleteDialog onClick={onDelete}>
									Really want to delete item {`'${name}'`}?
								</ConfirmDeleteDialog>
							</Grid>
						</Grid>
						<Grid item xs={6.5} />
						<Grid item xs={2.5}>
							<Button
								variant="contained"
								sx={{ backgroundColor: 'grey', width: 1 }}
								onClick={() => navigate(`/reviews/item/${id}`)}
							>
								See reviews
							</Button>
						</Grid>
					</Grid>
				)}
			</Card>
		</Box>
	);
};

export default ItemPreview;
