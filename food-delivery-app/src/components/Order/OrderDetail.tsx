import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import { OrderDto } from '../../types/Order.Types';
import useLoggedInUser from '../../hooks/useLoggedInUser';
import { Role } from '../../types/User.Types';

const OrderDetail: FC<OrderDto> = ({
	restaurant,
	price,
	paymentMethod,
	note,
	dateTimeOffset,
	user
}) => {
	const principal = useLoggedInUser();
	return (
		<Box>
			<ul>
				<li>Name: {restaurant.name}</li>
				<li>Price: {price}</li>
				<li>Pay method: {paymentMethod}</li>
				<li>Note: {note}</li>
				<li>Date: {new Date(dateTimeOffset).toLocaleDateString()}</li>
			</ul>
			{principal?.role === Role.Admin && (
				<>
					<Typography variant="h6">Customer info:</Typography>
					<ul>
						<li>Name: {`${user?.firstName} ${user?.lastName}`}</li>
						<li>Phone number: {user?.phoneNumber}</li>
					</ul>
				</>
			)}
		</Box>
	);
};

export default OrderDetail;
