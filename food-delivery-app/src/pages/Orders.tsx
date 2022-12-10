import { FC, useEffect } from 'react';
import { Grid } from '@mui/material';

import usePageTitle from '../hooks/usePageTitle';
import OrderPreview from '../components/Order/OrderPreview';
import { AppAlertTypes } from '../types/AppAlert.Types';
import { useAlert } from '../hooks/useAppAlert';
import useLoggedInUser from '../hooks/useLoggedInUser';
import { Role } from '../types/User.Types';
import { useGetAllOrders, useGetOrders } from '../hooks/useApi';

const Orders: FC = () => {
	usePageTitle('My Orders');
	const user = useLoggedInUser();
	const [, setAlertOptions] = useAlert();

	const { isError, data, error } =
		user?.role !== Role.Admin ? useGetOrders() : useGetAllOrders();

	useEffect(() => {
		if (isError) {
			setAlertOptions({
				showAlert: true,
				alertType: AppAlertTypes.Error,
				alertMessage: error?.message
			});
		}
	}, [isError]);

	return (
		<Grid container justifyContent="center">
			<Grid item md={4}>
				{data?.data.map(order => (
					<OrderPreview
						key={order.id}
						id={order.id}
						restaurant={order.restaurant}
						price={order.price}
						dateTimeOffset={order.dateTimeOffset}
					/>
				))}
			</Grid>
		</Grid>
	);
};

export default Orders;
