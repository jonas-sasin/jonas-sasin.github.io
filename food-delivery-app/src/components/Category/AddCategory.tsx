import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Typography
} from '@mui/material';
import { FC, ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from 'react-query';

import useLoggedInUser from '../../hooks/useLoggedInUser';
import useField from '../../hooks/useField';
import {
	usePostItemCategory,
	usePostRestaurantCategory
} from '../../hooks/useApi';
import { CategoryUpsertDto } from '../../types/Shared.Types';

type Props = {
	children: (open: () => void) => ReactNode;
	isItem: boolean;
};

const AddCategory: FC<Props> = ({ children, isItem }) => {
	const qc = useQueryClient();
	const user = useLoggedInUser();
	const navigate = useNavigate();

	const addItemCatCall = usePostItemCategory(qc);
	const addRestaurantCatCall = usePostRestaurantCategory(qc);

	// Open state
	const [open, setOpen] = useState(false);

	// Fields
	const [name, nameProps] = useField('name', true);
	const [description, descriptionProps] = useField('description', false);

	const [submitError, setSubmitError] = useState<string>();

	// Close and reset handler
	const closeDialog = () => {
		setOpen(false);
		descriptionProps.onChange({ target: { value: '' } } as never);
		setSubmitError(undefined);
	};

	// Submit handler
	const handleSubmit = async () => {
		if (!user?.id) {
			setSubmitError('You are not signed in');
			return;
		}

		try {
			// post category
			const newCat: CategoryUpsertDto = {
				name,
				description
			};
			if (isItem) {
				await addItemCatCall.mutateAsync(newCat);
			} else {
				await addRestaurantCatCall.mutateAsync(newCat);
			}
			navigate('/categories');
			closeDialog();
		} catch (err) {
			setSubmitError('Unknown error occurred');
		}
	};

	return (
		<>
			{children(() => setOpen(true))}
			<Dialog open={open} onClose={closeDialog}>
				<DialogTitle>Add category</DialogTitle>
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
						Add
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default AddCategory;
