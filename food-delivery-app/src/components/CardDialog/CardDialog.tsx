import { Box, Button, Dialog, DialogContent } from '@mui/material';
import { FC } from 'react';
import { Form } from 'react-final-form';

import { CardCreateDto, CardDialogProps } from '../../types/Payment.Types';
import { cardValidator } from '../../utils/validationHelper';
import TextInput from '../TextInput/TextInput';

const CardDialog: FC<CardDialogProps> = ({
	userId,
	user,
	cardDialogOpened,
	handleCloseCardDialog,
	createCard
}) => (
	<Dialog open={cardDialogOpened} onClose={handleCloseCardDialog}>
		<DialogContent
			sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: 2,
				minWidth: 500
			}}
		>
			<Form
				initialValues={{ userId }}
				onSubmit={async (values: CardCreateDto) => {
					values.user = user;
					createCard(values);
					handleCloseCardDialog();
				}}
				validate={values => cardValidator(values)}
				render={({ handleSubmit }) => (
					<Box
						component="form"
						onSubmit={handleSubmit}
						sx={{
							display: 'flex',
							flexDirection: 'column',
							width: '100%',
							p: 4,
							gap: 2
						}}
					>
						<TextInput
							id="ownerName"
							label="Owner name"
							name="ownerName"
							required
						/>
						<TextInput
							id="number"
							label="Card number"
							name="number"
							type="number"
							required
						/>
						<TextInput
							id="expirationDate"
							helperText="Expiration date"
							name="expirationDate"
							type="date"
							required
						/>
						<TextInput
							id="cvcCode"
							label="CVC"
							name="cvcCode"
							type="number"
							required
						/>
						<Button type="submit">Create</Button>
						<Button onClick={handleCloseCardDialog}>Cancel</Button>
					</Box>
				)}
			/>
		</DialogContent>
	</Dialog>
);

export default CardDialog;
