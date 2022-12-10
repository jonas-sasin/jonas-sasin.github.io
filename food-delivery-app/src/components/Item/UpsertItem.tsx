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
	useGetItem,
	useGetItemCategories,
	usePostItem,
	useUpdateItem
} from '../../hooks/useApi';
import { ItemDto, ItemUpsertDto } from '../../types/Item.Types';

type Props = {
	children: (open: () => void) => ReactNode;
	restId?: string;
	itemId?: string;
};

const UpsertItem: FC<Props> = ({ children, restId, itemId }) => {
	const qc = useQueryClient();
	const user = useLoggedInUser();
	const navigate = useNavigate();

	const addRestaurantCall = usePostItem(qc);
	const updateRestaurantCall = itemId ? useUpdateItem(qc, itemId) : undefined;
	const getItemResult = itemId ? useGetItem(itemId) : undefined;

	const categoriesResult = useGetItemCategories();
	const categories = categoriesResult.data
		? categoriesResult.data.data
		: undefined;
	const [category, setCategory] = useState('');
	const [item, setItem] = useState<ItemDto>();

	// Open state
	const [open, setOpen] = useState(false);

	// Fields
	const [name, nameProps] = useField('name', true);
	const [description, descriptionProps] = useField('description', false);
	const [price, priceProps] = useField('price', true);

	const [submitError, setSubmitError] = useState<string>();

	// Close and reset handler
	const closeDialog = () => {
		setOpen(false);
		if (!itemId) {
			descriptionProps.onChange({
				target: { value: '' }
			} as never);
			nameProps.onChange({ target: { value: '' } } as never);
			priceProps.onChange({
				target: { value: '' }
			} as never);
			setCategory('');
		}
		setSubmitError(undefined);
	};

	// init update dialog fields
	useEffect(() => {
		if (getItemResult) {
			const item = getItemResult.data?.data;
			setItem(item);

			descriptionProps.onChange({
				target: { value: item?.description ?? '' }
			} as never);
			nameProps.onChange({ target: { value: item?.name ?? '' } } as never);
			priceProps.onChange({
				target: { value: item?.price ?? '' }
			} as never);
			setCategory(item?.itemCategory?.id ?? '');
		}
	}, [getItemResult?.data]);

	const handleChangeCategory = (event: SelectChangeEvent) => {
		setCategory(event.target.value);
	};

	// Submit handler
	const handleSubmit = async () => {
		if (!user?.id) {
			setSubmitError('You are not signed in');
			return;
		}
		if (isNaN(Number(price))) {
			setSubmitError('Enter number for price');
			return;
		}
		try {
			// post category
			const newItem: ItemUpsertDto = {
				id: item?.id,
				restaurantId: restId ?? '',
				name,
				description,
				price: Number(price),
				itemCategoryId: category
			};
			if (itemId) {
				await updateRestaurantCall?.mutateAsync(newItem);
			} else {
				await addRestaurantCall.mutateAsync(newItem);
			}
			navigate(`/restaurants/${restId}`);
			closeDialog();
		} catch (err) {
			setSubmitError('Unknown error occurred');
		}
	};

	return (
		<>
			{children(() => setOpen(true))}
			<Dialog open={open} onClose={closeDialog}>
				<DialogTitle>{itemId ? <>Edit item</> : <>Add new item</>}</DialogTitle>
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
					<TextField label="Price" fullWidth {...priceProps} />
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
						{itemId ? <>Update</> : <>Add</>}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default UpsertItem;
