import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from '@mui/material';

import usePageTitle from '../hooks/usePageTitle';
import OrderDetail from '../components/Order/OrderDetail';
import OldOrderSummary from '../components/Order/OldOrderSummary';
import { useGetOrder } from '../hooks/useApi';

const Order: FC = () => {
	const { id } = useParams();
	usePageTitle('Order detail');

	const orderResult = useGetOrder(id ?? '');
	const order = orderResult.data ? orderResult.data.data : undefined;

	const totalPrice = () => {
		let price = 0;
		order?.orderItems?.forEach(orderItem => {
			const item = orderItem.item;
			if (item) {
				price += orderItem.amount * item.price;
			}
		});
		return price;
	};

	return (
		<Grid container>
			<Grid item xs={5}>
				{order && (
					<OrderDetail
						id={order.id}
						restaurant={order.restaurant}
						price={order.price}
						paymentMethod={order.paymentMethod}
						note={order.note}
						dateTimeOffset={order.dateTimeOffset}
						user={order.user}
					/>
				)}
			</Grid>
			<Grid
				item
				xs={5}
				className="left-pane"
				alignItems="center"
				justifyContent="center"
			>
				{order && (
					<OldOrderSummary
						price={order.price === 0 ? totalPrice() : order.price}
						orderItems={order.orderItems ?? []}
					/>
				)}
			</Grid>
		</Grid>
	);
};

export default Order;
