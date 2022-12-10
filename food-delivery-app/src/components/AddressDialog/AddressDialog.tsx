import { Box, Button, Dialog, DialogContent } from '@mui/material';
import { FC } from 'react';
import { Form } from 'react-final-form';

import {
	AddressDialogProps,
	AddressUpsertDto
} from '../../types/Address.Types';
import { addressVlidator } from '../../utils/validationHelper';
import TextInput from '../TextInput/TextInput';

const AddressDialog: FC<AddressDialogProps> = ({
	userId,
	address,
	addressDialogOpened,
	handleCloseAddressDialog,
	updateAddress,
	createAddress
}) => (
	<Dialog open={addressDialogOpened} onClose={handleCloseAddressDialog}>
		<DialogContent
			sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: 2,
				minWidth: 500
			}}
		>
			<Form
				initialValues={{ ...address, userId }}
				onSubmit={async (values: AddressUpsertDto) => {
					if (address === undefined) {
						createAddress(values);
					} else {
						updateAddress(values);
					}
					handleCloseAddressDialog();
				}}
				validate={values => addressVlidator(values)}
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
						<TextInput id="street" label="Street" name="street" />
						<TextInput
							id="number"
							label="Street number"
							name="number"
							type="number"
						/>
						<TextInput
							id="zipCode"
							label="Zip code"
							name="zipCode"
							type="number"
						/>
						<TextInput id="town" label="Town" name="town" />
						<TextInput
							id="flatNumber"
							label="Flat number"
							name="flatNumber"
							type="number"
						/>
						<TextInput id="note" label="Note" name="note" type="textarea" />
						<Button type="submit">Save</Button>
						<Button onClick={handleCloseAddressDialog}>Cancel</Button>
					</Box>
				)}
			/>
		</DialogContent>
	</Dialog>
);

export default AddressDialog;
