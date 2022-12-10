import { FC, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { useQueryClient } from 'react-query';

import RestaurantDetail from '../components/Restaurant/RestaurantDetail';
import usePageTitle from '../hooks/usePageTitle';
import ItemPreview from '../components/Item/ItemPreview';
import { useOrderState } from '../hooks/useOrderState';
import OrderSummary from '../components/Order/OrderSummary';
import {
	useDeleteItem,
	useGetItemsForRestaurant,
	useGetRestaurant
} from '../hooks/useApi';
import FinishOrder from '../components/Order/FinishOrder';
import useLoggedInUser from '../hooks/useLoggedInUser';
import { Role } from '../types/User.Types';
import UpsertItem from '../components/Item/UpsertItem';
import { AppAlertTypes } from '../types/AppAlert.Types';
import { useAlert } from '../hooks/useAppAlert';
import AddReview from '../components/Review/AddReview';
import ColoredLine from '../components/Shared/ColoredLine';

const RestaurantMenu: FC = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const user = useLoggedInUser();
	const qc = useQueryClient();
	const [, setAlertOptions] = useAlert();

	const restaurantResult = useGetRestaurant(id ?? '');
	const itemsResult = useGetItemsForRestaurant(id ?? '');

	// api calls;
	const deleteItemCall = useDeleteItem(qc);

	const [orderState] = useOrderState();

	const restaurant = restaurantResult.data
		? restaurantResult.data.data
		: undefined;
	const [items, setItems] = useState(
		itemsResult.data ? itemsResult.data.data : undefined
	);
	usePageTitle(restaurant ? restaurant.name : 'Restaurant menu');

	const totalPrice = () => {
		let price = 0;
		orderState.forEach(orderItem => {
			const item = items?.find(i => i.id === orderItem.itemId);
			if (item) {
				price += orderItem.amount * item.price;
			}
		});
		return price;
	};

	// update on refresh
	useEffect(() => {
		setItems(itemsResult.data ? itemsResult.data.data : undefined);
	}, [itemsResult.data]);

	const onDeleteClick = useCallback(async (id?: string) => {
		try {
			await deleteItemCall.mutateAsync(id ?? '');
			if (items) {
				let newItems = [...items];
				newItems = newItems.filter(cat => cat.id !== id);
				setItems(newItems);
			}
		} catch (e) {
			setAlertOptions({
				showAlert: true,
				alertType: AppAlertTypes.Error,
				alertMessage: 'Unknown error occurred'
			});
		}
	}, []);

	const categories = items
		?.map(item => item.itemCategory?.name)
		.filter((v, i, a) => a.indexOf(v) === i);
	return (
		<Container>
			<Grid container>
				<Grid item xs={8} justifyContent="center">
					{restaurant && <RestaurantDetail {...restaurant} />}
				</Grid>
				<Grid item container xs={4} justifyContent="right">
					<Grid item xs={4}>
						{user?.role !== Role.Admin && (
							<AddReview restaurantId={id}>
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
						)}
					</Grid>
					<Grid item xs={5}>
						<Button
							variant="contained"
							sx={{ backgroundColor: 'grey' }}
							onClick={() => navigate(`/reviews/restaurant/${id}`)}
						>
							See reviews
						</Button>
					</Grid>
				</Grid>
			</Grid>
			<ColoredLine color="gray" />
			<Box sx={{ minHeight: 40 }} />
			<Grid container spacing={2}>
				<Grid
					container
					justifyContent="center"
					className="left-pane"
					item
					xs={8}
					rowSpacing={8}
				>
					{categories?.map(cat => (
						<Grid item container key={cat} rowSpacing={2}>
							<Typography fontSize={40}>{cat}</Typography>
							{items
								?.filter(item => item.itemCategory?.name === cat)
								.map(item => (
									<Grid key={item.id} item xs={12}>
										<ItemPreview
											id={item.id}
											name={item.name}
											averageRating={item.averageRating}
											description={item.description}
											price={item.price}
											onDelete={() => onDeleteClick(item.id)}
											restId={id}
										/>
									</Grid>
								))}
						</Grid>
					))}
				</Grid>
				{user?.role !== Role.Admin ? (
					<Grid
						className="right-pane"
						item
						xs={4}
						alignItems="center"
						justifyContent="center"
					>
						<Typography variant="h3" textAlign="center">
							Summary:
						</Typography>
						<OrderSummary items={items} totalPrice={totalPrice()} />
						{orderState.length > 0 && (
							<FinishOrder
								totalPrice={totalPrice()}
								items={items}
								restaurantId={id ?? ''}
							>
								{open => (
									<Button onClick={open} variant="contained">
										Finish order
									</Button>
								)}
							</FinishOrder>
						)}
					</Grid>
				) : (
					<Grid item xs={4} alignItems="center" justifyContent="center">
						<UpsertItem restId={id}>
							{open => (
								<Button
									onClick={open}
									variant="contained"
									sx={{ backgroundColor: 'darkslategrey', width: 1 }}
								>
									Create new item
								</Button>
							)}
						</UpsertItem>
					</Grid>
				)}
			</Grid>
		</Container>
	);
};

export default RestaurantMenu;
