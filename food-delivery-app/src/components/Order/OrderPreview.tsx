import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';

import { OrderDto } from '../../types/Order.Types';

const OrderPreview: FC<OrderDto> = ({
	id,
	restaurant,
	price,
	dateTimeOffset
}) => (
	<Box>
		<Button
			component={Link}
			to={`/orders/${id}`}
			sx={{
				width: 1,
				textAlign: 'left'
			}}
		>
			<Card
				sx={{
					width: 1,
					textAlign: 'left'
				}}
			>
				<CardContent>
					<Typography color="textSecondary" textAlign="center">
						{restaurant?.name}
					</Typography>
					<Typography variant="h6" textAlign="center">
						{price} $
					</Typography>
					<Typography textAlign="center">
						{new Date(dateTimeOffset).toLocaleString()}
					</Typography>
				</CardContent>
			</Card>
		</Button>
	</Box>
);

export default OrderPreview;
