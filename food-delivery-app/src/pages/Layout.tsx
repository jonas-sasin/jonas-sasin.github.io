import { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Container, CssBaseline } from '@mui/material';

import NavBar from '../components/Shared/NavBar';
import AppAlert from '../components/Alert/AppAlert';
import { useAlert } from '../hooks/useAppAlert';
import { OrderStateProvider } from '../hooks/useOrderState';

import Home from './Home';
import Login from './Login';
import Me from './Me';
import Orders from './Orders';
import Restaurants from './Restaurants';
import UserManagement from './UserManagement';
import Order from './Order';
import RestaurantMenu from './RestaurantMenu';
import Reviews from './Reviews';
import NotFound from './NotFound';
import CategoryManagement from './CategoryManagement';

const Layout: FC = () => {
	const [alert, setAlertOptions] = useAlert();

	const mainStyle = {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		flexGrow: 1,
		gap: 2,
		py: 2
	};

	return (
		<BrowserRouter>
			<CssBaseline />
			<NavBar />
			<AppAlert
				showAlert={alert.showAlert}
				alertType={alert.alertType}
				alertMessage={alert.alertMessage}
				setAppAlertOptions={setAlertOptions}
			/>
			<Container maxWidth="lg" component="main" sx={mainStyle}>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/me" element={<Me />} />
					<Route path="/orders" element={<Orders />} />
					<Route path="/categories" element={<CategoryManagement />} />
					<Route path="/restaurants" element={<Restaurants />} />
					<Route path="/users" element={<UserManagement />} />
					<Route path="/orders/:id" element={<Order />} />
					<Route
						path="/restaurants/:id"
						element={
							<OrderStateProvider>
								<RestaurantMenu />
								<OrderStateProvider />
							</OrderStateProvider>
						}
					/>
					<Route path="/reviews/:type/:id" element={<Reviews />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Container>
		</BrowserRouter>
	);
};

export default Layout;
