import { FC } from 'react';
import { List, ListItem, Paper, Typography } from '@mui/material';

import { OrderItemDto } from '../../types/Order.Types';
import ColoredLine from '../Shared/ColoredLine';

type OrderSummaryProps = {
	orderItems: OrderItemDto[];
	price: number;
};

const OldOrderSummary: FC<OrderSummaryProps> = ({ price, orderItems }) => (
	<>
		<Typography variant="h3" textAlign="center">
			Summary:
		</Typography>
		<Paper style={{ overflow: 'auto', minHeight: '400' }}>
			<List>
				{orderItems
					.filter(o => o.amount > 0)
					.map(orderItem => (
						<ListItem key={orderItem.id}>
							{orderItem.item.name} : {orderItem.amount}x (
							{orderItem.item.price}$)
						</ListItem>
					))}
			</List>
			<ColoredLine color="grey" />
			<Typography>Total price: {price} $</Typography>
		</Paper>
		<div />
	</>
);

export default OldOrderSummary;
