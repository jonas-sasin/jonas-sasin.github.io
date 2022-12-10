import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	TextField,
	Typography
} from '@mui/material';
import { FC, ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from 'react-query';

import useLoggedInUser from '../../hooks/useLoggedInUser';
import useField from '../../hooks/useField';
import {
	useGetAddresses,
	useGetRestaurant,
	useGetRestaurantCategories,
	usePostRestaurant,
	useUpdateRestaurant
} from '../../hooks/useApi';
import {
	RestaurantDto,
	RestaurantUpsertDto
} from '../../types/Restaurant.Types';
import { AddressDto } from '../../types/Address.Types';

type Props = {
	children: (open: () => void) => ReactNode;
	restaurantId?: string;
};

const UpsertRestaurant: FC<Props> = ({ children, restaurantId }) => {
	const qc = useQueryClient();
	const user = useLoggedInUser();
	const navigate = useNavigate();

	// api calls
	const addRestaurantCall = usePostRestaurant(qc);
	const updateRestaurantCall = restaurantId
		? useUpdateRestaurant(qc, restaurantId)
		: undefined;
	const getRestaurantCall = restaurantId
		? useGetRestaurant(restaurantId)
		: undefined;
	const addressResult = useGetAddresses();
	const categoriesResult = useGetRestaurantCategories();

	// data
	const categories = categoriesResult.data
		? categoriesResult.data.data
		: undefined;
	const [addresses, setAddresses] = useState<AddressDto[]>();
	const [restaurant, setRestaurant] = useState<RestaurantDto>();
	const [address, setAddress] = useState('');
	const [category, setCategory] = useState('');

	// Open state
	const [open, setOpen] = useState(false);

	// Fields
	const [name, nameProps] = useField('name', true);
	const [description, descriptionProps] = useField('description', false);

	const [submitError, setSubmitError] = useState<string>();

	// init fields after dialog open
	useEffect(() => {
		const addresses = addressResult.data?.data;
		if (getRestaurantCall) {
			const restaurant = getRestaurantCall.data?.data;
			setRestaurant(restaurant);
			if (addresses && restaurant?.address) {
				const newAddresses = [...addresses];
				newAddresses.push(restaurant.address);
				setAddresses(newAddresses);
			}

			descriptionProps.onChange({
				target: { value: restaurant?.description ?? '' }
			} as never);
			nameProps.onChange({
				target: { value: restaurant?.name ?? '' }
			} as never);
			setAddress(restaurant?.address?.id ?? '');
			setCategory(restaurant?.restaurantCategory?.id ?? '');
		} else {
			setAddresses(addresses);
		}
	}, [addressResult?.data, getRestaurantCall?.data]);

	// Close and reset handler
	const closeDialog = () => {
		setOpen(false);
		if (!restaurantId) {
			descriptionProps.onChange({
				target: { value: '' }
			} as never);
			nameProps.onChange({
				target: { value: '' }
			} as never);
			setAddress('');
			setCategory('');
		}
		setSubmitError(undefined);
	};

	const handleChangeAddress = (event: SelectChangeEvent) => {
		setAddress(event.target.value);
	};

	const handleChangeCategory = (event: SelectChangeEvent) => {
		setCategory(event.target.value);
	};

	// Submit handler
	const handleSubmit = async () => {
		if (!user?.id) {
			setSubmitError('You are not signed in');
			return;
		}

		try {
			// post category
			const newRestaurant: RestaurantUpsertDto = {
				name,
				description,
				addressId: address,
				restaurantCategoryId: category,
				id: restaurant?.id
			};
			if (restaurant && updateRestaurantCall) {
				await updateRestaurantCall.mutateAsync(newRestaurant);
			} else {
				await addRestaurantCall.mutateAsync(newRestaurant);
			}
			navigate('/restaurants');
			closeDialog();
		} catch (err) {
			setSubmitError('Unknown error occurred');
		}
	};

	return (
		<>
			{children(() => setOpen(true))}
			<Dialog open={open} onClose={closeDialog}>
				<DialogTitle>
					{restaurantId ? <>Edit restaurant</> : <>Add new restaurant</>}
				</DialogTitle>
				<DialogContent
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: 2,
						minWidth: 500
					}}
				>
					<TextField label="Name" fullWidth {...nameProps} />
					<TextField label="Description" fullWidth {...descriptionProps} />
					<FormControl fullWidth>
						<InputLabel id="address-label">Address information</InputLabel>
						<Select
							labelId="address-info-label"
							id="address-select"
							value={address}
							label="Address information"
							onChange={handleChangeAddress}
						>
							{addresses?.map(a => (
								<MenuItem key={a.id} value={a.id}>
									{`${a.street} ${a.number} , ${a.town} ${a.zipCode}`}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<FormControl fullWidth>
						<InputLabel id="category-label">Category</InputLabel>
						<Select
							labelId="category-info-label"
							id="category-select"
							value={category}
							label="Category"
							onChange={handleChangeCategory}
						>
							{categories?.map(a => (
								<MenuItem key={a.id} value={a.id}>
									{a.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</DialogContent>
				<DialogActions>
					{submitError && (
						<Typography
							variant="subtitle2"
							align="left"
							color="error"
							paragraph
						>
							{submitError}
						</Typography>
					)}
					<Button onClick={closeDialog}>Cancel</Button>
					<Button onClick={handleSubmit} variant="contained">
						{restaurantId ? <>Update</> : <>Add</>}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default UpsertRestaurant;
