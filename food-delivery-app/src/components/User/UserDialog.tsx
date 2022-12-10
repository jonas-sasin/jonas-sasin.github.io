import {
	Box,
	Button,
	Dialog,
	DialogContent,
	Typography,
	MenuItem
} from '@mui/material';
import { FC } from 'react';
import { Form } from 'react-final-form';

import { UserDto, UserUpdateDto } from '../../types/User.Types';
import { userUpdateValidator } from '../../utils/validationHelper';
import TextInput from '../TextInput/TextInput';

type UserDialogProps = {
	user: UserDto | undefined;
	openUserDialog: boolean;
	handleCloseDialog: () => void;
	updateUser: (user: UserUpdateDto) => void;
};

const UserDialog: FC<UserDialogProps> = ({
	user,
	openUserDialog,
	handleCloseDialog,
	updateUser
}) => (
	<Dialog open={openUserDialog} onClose={handleCloseDialog}>
		<DialogContent
			sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: 2,
				minWidth: 500
			}}
		>
			<Form
				initialValues={user}
				onSubmit={async (values: UserUpdateDto) => {
					if (user !== undefined) {
						updateUser(values);
						handleCloseDialog();
					}
				}}
				validate={values => userUpdateValidator(values)}
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
						<Typography variant="h4" component="h2" textAlign="center" mb={3}>
							User information
						</Typography>
						<TextInput
							id="phoneNumber"
							label="Phone number"
							name="phoneNumber"
							required
						/>
						<TextInput
							id="firstName"
							label="First name"
							name="firstName"
							required
						/>
						<TextInput
							id="lastName"
							label="Last name"
							name="lastName"
							required
						/>
						<TextInput id="role" label="Role" name="Role" select required>
							<MenuItem value="Admin">Admin</MenuItem>
							<MenuItem value="User">User</MenuItem>
						</TextInput>
						<TextInput
							id="password"
							label="New password"
							name="password"
							type="password"
						/>
						<Button type="submit">Save</Button>
						<Button onClick={handleCloseDialog}>Cancel</Button>
					</Box>
				)}
			/>
		</DialogContent>
	</Dialog>
);

export default UserDialog;
