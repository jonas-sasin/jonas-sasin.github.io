import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Grid, Typography } from '@mui/material';

import usePageTitle from '../hooks/usePageTitle';
import { useGetItemReviews, useGetRestaurantReviews } from '../hooks/useApi';
import { RatingDto } from '../types/Rating.Types';
import ReviewPreview from '../components/Review/ReviewPreview';

const Reviews: FC = () => {
	const { type, id } = useParams();
	usePageTitle(`${type} Reviews`);

	const itemReviewsResult =
		type === 'item' ? useGetItemReviews(id ?? '') : undefined;
	const restaurantReviewsResult =
		type === 'restaurant' ? useGetRestaurantReviews(id ?? '') : undefined;

	const [reviews, setReviews] = useState<RatingDto[]>();

	useEffect(() => {
		if (itemReviewsResult) {
			setReviews(
				itemReviewsResult.data ? itemReviewsResult.data.data : undefined
			);
		}
		if (restaurantReviewsResult) {
			setReviews(
				restaurantReviewsResult.data
					? restaurantReviewsResult.data.data
					: undefined
			);
		}
	}, [itemReviewsResult?.data, restaurantReviewsResult?.data]);

	return (
		<Container>
			<Typography variant="h3">Reviews for {`${type}`}</Typography>
			<Grid container rowSpacing={2}>
				{reviews?.map(review => (
					<Grid key={review.id} item xs={12}>
						<ReviewPreview
							id={review.id}
							user={review.user}
							numberOfStars={review.numberOfStars}
							comment={review.comment}
						/>
					</Grid>
				))}
			</Grid>
		</Container>
	);
};

export default Reviews;
