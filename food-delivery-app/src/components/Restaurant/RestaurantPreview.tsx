import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { Edit } from '@mui/icons-material';

import ReviewStars from '../Shared/ReviewStars';
import { RestaurantDto } from '../../types/Restaurant.Types';
import useLoggedInUser from '../../hooks/useLoggedInUser';
import { Role } from '../../types/User.Types';
import ConfirmDeleteDialog from '../Shared/ConfirmDeleteDialog';

import UpsertRestaurant from './UpsertRestaurant';

type RestaurantPreviewProps = RestaurantDto & {
	onDelete: () => void;
};

const RestaurantPreview: FC<RestaurantPreviewProps> = ({
	id,
	name,
	averageRating,
	restaurantCategory,
	onDelete
}) => {
	const user = useLoggedInUser();
	return (
		<Grid item xs={12} md={4}>
			<Card sx={{ width: 1 }}>
				<Button component={Link} to={`/restaurants/${id}`} sx={{ width: 1 }}>
					<CardContent sx={{ width: 'inherit' }}>
						<Typography variant="h6" textAlign="center" color="textSecondary">
							{name}
						</Typography>
						<Typography textAlign="center">
							<ReviewStars stars={averageRating} />
						</Typography>
						<Typography sx={{ fontSize: 15 }} textAlign="left">
							{restaurantCategory?.name}
						</Typography>
					</CardContent>
				</Button>
				{user && user.role === Role.Admin && (
					<Grid container columnSpacing={1}>
						<Grid item>
							<UpsertRestaurant restaurantId={id}>
								{open => (
									<Button onClick={open} variant="contained">
										<Edit />
									</Button>
								)}
							</UpsertRestaurant>
						</Grid>
						<Grid item>
							<ConfirmDeleteDialog onClick={onDelete}>
								Really want to delete restaurant {`'${name}'`}?
							</ConfirmDeleteDialog>
						</Grid>
					</Grid>
				)}
			</Card>
		</Grid>
	);
};

export default RestaurantPreview;
