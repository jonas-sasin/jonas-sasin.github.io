import { FC, useCallback, useEffect, useState } from 'react';
import {
	Box,
	Button,
	Container,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent
} from '@mui/material';
import { useQueryClient } from 'react-query';

import usePageTitle from '../hooks/usePageTitle';
import RestaurantPreview from '../components/Restaurant/RestaurantPreview';
import { AppAlertTypes } from '../types/AppAlert.Types';
import { useAlert } from '../hooks/useAppAlert';
import {
	useDeleteRestaurant,
	useGetRestaurantCategories,
	useGetRestaurantsFilteredAndPaged,
	useGetRestaurantsFilteredCount
} from '../hooks/useApi';
import useLoggedInUser from '../hooks/useLoggedInUser';
import { Role } from '../types/User.Types';
import UpsertRestaurant from '../components/Restaurant/UpsertRestaurant';
import ColoredLine from '../components/Shared/ColoredLine';

const Restaurants: FC = () => {
	usePageTitle('Restaurants');
	const qc = useQueryClient();
	const user = useLoggedInUser();
	const [, setAlertOptions] = useAlert();

	const [pageSize, setPageSize] = useState(6);
	const [page, setPage] = useState(1);
	const [category, setCategory] = useState('');
	const [minRating, setMinRating] = useState<number>();

	// api calls;
	const deleteRestaurantCall = useDeleteRestaurant(qc);

	// api call results
	const restaurantResult = useGetRestaurantsFilteredAndPaged({
		page: page.toString(),
		pageSize: pageSize.toString(),
		categoryId: category,
		minAvgRating: minRating?.toString()
	});
	const restaurantCountResult = useGetRestaurantsFilteredCount({
		categoryId: category,
		minAvgRating: minRating?.toString()
	});
	const categoriesResult = useGetRestaurantCategories();

	const categories = categoriesResult.data
		? categoriesResult.data.data
		: undefined;
	// data
	const [restaurants, setRestaurants] = useState(
		restaurantResult.data ? restaurantResult.data.data : undefined
	);
	const [restaurantCount, setRestaurantCount] = useState(
		restaurantCountResult.data ? restaurantCountResult.data.data : undefined
	);
	// handling data updates
	useEffect(() => {
		if (restaurantResult.isError) {
			setAlertOptions({
				showAlert: true,
				alertType: AppAlertTypes.Error,
				alertMessage: restaurantResult.error?.message
			});
		}
	}, [restaurantResult.isError]);
	useEffect(() => {
		setRestaurants(
			restaurantResult.data ? restaurantResult.data.data : undefined
		);
		setRestaurantCount(
			restaurantCountResult.data ? restaurantCountResult.data.data : undefined
		);
	}, [restaurantResult.data, restaurantCountResult.data]);

	const onDeleteClick = useCallback(async (id?: string) => {
		try {
			await deleteRestaurantCall.mutateAsync(id ?? '');
			if (restaurants) {
				let newRestaurants = [...restaurants];
				newRestaurants = newRestaurants.filter(cat => cat.id !== id);
				setRestaurants(newRestaurants);
			}
		} catch (e) {
			setAlertOptions({
				showAlert: true,
				alertType: AppAlertTypes.Error,
				alertMessage: 'Unknown error occurred'
			});
		}
	}, []);

	const handleChangeCategory = (event: SelectChangeEvent) => {
		setCategory(event.target.value);
	};

	const handleChangeMinRating = (event: SelectChangeEvent) => {
		const value = Number(event.target.value);
		setMinRating(isNaN(value) ? undefined : value);
	};

	const handleChangePageSize = (event: SelectChangeEvent) => {
		const value = Number(event.target.value);
		setPageSize(isNaN(value) ? 3 : value);
		const pageCount = Number(Math.ceil((restaurantCount ?? value) / value));
		if (page > pageCount) {
			setPage(pageCount);
		}
	};

	const onClick = (i: number) => {
		setPage(i);
	};

	const getButtonVariant = (i: number) =>
		i + 1 === page ? 'outlined' : 'contained';

	const pageCount = Number(Math.ceil((restaurantCount ?? pageSize) / pageSize));

	return (
		<Container>
			<Grid container spacing={1}>
				<Grid item xs={2}>
					<FormControl fullWidth>
						<InputLabel id="paging-label">Page size</InputLabel>
						<Select
							labelId="paging-info-label"
							id="paging-select"
							value={pageSize?.toString() ?? ''}
							label="Page size"
							onChange={handleChangePageSize}
						>
							{[...Array(5).keys()].map(i => (
								<MenuItem key={i} value={(i + 1) * 3}>
									{(i + 1) * 3}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={4}>
					<FormControl fullWidth>
						<InputLabel id="category-label">Category</InputLabel>
						<Select
							labelId="category-info-label"
							id="category-select"
							value={category ?? ''}
							label="Category"
							onChange={handleChangeCategory}
						>
							<MenuItem key="" value="">
								-
							</MenuItem>
							{categories?.map(a => (
								<MenuItem key={a.id} value={a.id}>
									{a.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={4}>
					<FormControl fullWidth>
						<InputLabel id="rating-label">Minimal Rating</InputLabel>
						<Select
							labelId="rating-info-label"
							id="rating-select"
							value={minRating?.toString() ?? ''}
							label="Minimal Rating"
							onChange={handleChangeMinRating}
						>
							<MenuItem key="" value="">
								-
							</MenuItem>
							{[...Array(5).keys()].map(i => (
								<MenuItem key={i} value={i + 1}>
									{i + 1}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Grid>
			</Grid>
			{user?.role === Role.Admin && (
				<>
					<Box sx={{ minHeight: 20 }} />
					<UpsertRestaurant>
						{open => (
							<Button onClick={open} variant="contained">
								Create new restaurant
							</Button>
						)}
					</UpsertRestaurant>
				</>
			)}
			<Box sx={{ minHeight: 80 }} />
			<Grid container spacing={2} justifyContent="left">
				{restaurants?.map(restaurant => (
					<RestaurantPreview
						key={restaurant.id}
						id={restaurant.id}
						name={restaurant.name}
						averageRating={restaurant.averageRating}
						restaurantCategory={restaurant.restaurantCategory}
						onDelete={() => onDeleteClick(restaurant.id)}
					/>
				))}
			</Grid>
			{pageCount > 1 && (
				<>
					<Box sx={{ minHeight: 100 }} />
					<ColoredLine color="grey" />
					<Grid
						container
						sx={{ bottom: 0 }}
						justifyContent="center"
						spacing={1}
					>
						{[...Array(pageCount).keys()].map(i => (
							<Grid item key={i}>
								<Button
									key={i}
									variant={getButtonVariant(i)}
									color="primary"
									disabled={i + 1 === page}
									onClick={() => onClick(i + 1)}
								>
									{i + 1}
								</Button>
							</Grid>
						))}
					</Grid>
				</>
			)}
		</Container>
	);
};

export default Restaurants;
