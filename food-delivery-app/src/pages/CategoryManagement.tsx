import { FC } from 'react';
import { Container, Grid, Typography } from '@mui/material';

import usePageTitle from '../hooks/usePageTitle';
import {
	useGetItemCategories,
	useGetRestaurantCategories
} from '../hooks/useApi';
import CategoryTable from '../components/Category/CategoryTable';

const CategoryManagement: FC = () => {
	usePageTitle('Manage categories');

	const restaurantCategoryResult = useGetRestaurantCategories();
	const itemCategoryResult = useGetItemCategories();

	const restaurantCategories = restaurantCategoryResult.data
		? restaurantCategoryResult.data.data
		: undefined;
	const itemCategories = itemCategoryResult.data
		? itemCategoryResult.data.data
		: undefined;

	return (
		<Container maxWidth="md">
			<Grid container rowSpacing={8}>
				<Grid item xs={12}>
					<Typography variant="h3">Restaurant categories</Typography>
					<CategoryTable cats={restaurantCategories} isItem={false} />
				</Grid>
				<Grid item xs={12}>
					<Typography variant="h3">Item categories</Typography>
					<CategoryTable cats={itemCategories} isItem />
				</Grid>
			</Grid>
		</Container>
	);
};

export default CategoryManagement;
