import { FC } from 'react';
import { List, ListItem, Paper, Typography } from '@mui/material';

import { ItemDto } from '../../types/Item.Types';
import ColoredLine from '../Shared/ColoredLine';
import { useOrderState } from '../../hooks/useOrderState';

type OrderSummaryProps = {
	items?: ItemDto[];
	totalPrice: number;
};

const OrderSummary: FC<OrderSummaryProps> = ({ items, totalPrice }) => {
	const [orderState] = useOrderState();
	return (
		<Paper style={{ overflow: 'auto', minHeight: '400' }}>
			<List>
				{orderState
					.filter(o => o.amount > 0)
					.map(orderItem => (
						<ListItem key={orderItem.itemId}>
							{items?.find(i => i.id === orderItem.itemId)?.name} :{' '}
							{orderItem.amount}x
						</ListItem>
					))}
			</List>
			<ColoredLine color="grey" />
			<Typography>Total price: {totalPrice} $</Typography>
			<ColoredLine color="grey" />
		</Paper>
	);
};

export default OrderSummary;
