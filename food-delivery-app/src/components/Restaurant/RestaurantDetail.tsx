import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import ReviewStars from '../Shared/ReviewStars';
import { RestaurantDto } from '../../types/Restaurant.Types';

const RestaurantDetail: FC<RestaurantDto> = ({
	name,
	description,
	averageRating,
	address,
	restaurantCategory
}) => (
	<Box>
		<ul>
			<Typography fontSize={40}>{name}</Typography>
			<ReviewStars stars={averageRating} />
			<Typography>Description: {description}</Typography>
			<li>
				Address: {`${address?.street} ${address?.number}, ${address?.town}`}
			</li>
			<li>RestaurantCategory: {restaurantCategory.name}</li>
		</ul>
	</Box>
);

export default RestaurantDetail;
