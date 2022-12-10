import { Star, StarBorder } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { FC, useCallback } from 'react';
import { useQueryClient } from 'react-query';

import { RatingDto } from '../../types/Rating.Types';
import useLoggedInUser from '../../hooks/useLoggedInUser';
import { useDeleteReview } from '../../hooks/useApi';

const ReviewPreview: FC<RatingDto> = ({ id, user, numberOfStars, comment }) => {
	const principal = useLoggedInUser();
	const qc = useQueryClient();
	const deleteReviewCall = useDeleteReview(qc);
	const onClick = useCallback(async (id: string) => {
		try {
			await deleteReviewCall.mutateAsync(id);
		} catch (e) {
			console.log('handle error');
		}
	}, []);

	return (
		<Card
			sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				width: '100%',
				textAlign: 'left'
			}}
		>
			<CardContent>
				<Typography variant="h5" color="textSecondary">
					{`${user.firstName} ${user.lastName}`}
				</Typography>
				<Box mb={2}>
					{[...Array(5).keys()].map(i =>
						i < numberOfStars ? (
							<Star key={i} color="primary" />
						) : (
							<StarBorder key={i} color="primary" />
						)
					)}
				</Box>
				{comment && <Typography>{comment}</Typography>}
			</CardContent>
			{principal?.id === user.id && (
				<Button onClick={() => onClick(id ?? '')}>Delete</Button>
			)}
		</Card>
	);
};

export default ReviewPreview;
