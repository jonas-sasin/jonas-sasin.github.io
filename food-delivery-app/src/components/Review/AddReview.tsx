import { Star, StarBorder } from '@mui/icons-material';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	TextField,
	Typography
} from '@mui/material';
import { FC, ReactNode, useState } from 'react';
import { useQueryClient } from 'react-query';

import useLoggedInUser from '../../hooks/useLoggedInUser';
import useField from '../../hooks/useField';
import { usePostReview } from '../../hooks/useApi';
import { RatingUpsertDto } from '../../types/Rating.Types';

type Props = {
	children: (open: () => void) => ReactNode;
	restaurantId?: string;
	itemId?: string;
};

const AddReview: FC<Props> = ({ children, restaurantId, itemId }) => {
	const user = useLoggedInUser();
	const qc = useQueryClient();

	const addReviewCall = usePostReview(qc);

	// Open state
	const [open, setOpen] = useState(false);

	// Fields
	const [stars, setStars] = useState(1);
	const [description, descriptionProps] = useField('description');

	const [submitError, setSubmitError] = useState<string>();

	// Close and reset handler
	const closeDialog = () => {
		setOpen(false);
		setStars(0);
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
			const review: RatingUpsertDto = {
				comment: description,
				itemId,
				numberOfStars: stars,
				restaurantId,
				userId: user.id
			};
			await addReviewCall.mutateAsync(review);
			closeDialog();
		} catch (err) {
			setSubmitError('Unknown error has occurred');
		}
	};

	return (
		<>
			{children(() => setOpen(true))}
			<Dialog open={open} onClose={closeDialog}>
				<DialogTitle>Add review</DialogTitle>
				<DialogContent
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: 2,
						minWidth: 500
					}}
				>
					{/* Stars select */}
					<Box>
						{[...Array(5).keys()].map(i => (
							<IconButton
								key={i}
								color="primary"
								component="span"
								onClick={() => setStars(i + 1)}
							>
								{i < stars ? <Star /> : <StarBorder />}
							</IconButton>
						))}
					</Box>
					<TextField label="Comment" fullWidth {...descriptionProps} />
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
						Submit
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default AddReview;
