import { FC } from 'react';
import { Form } from 'react-final-form';
import { Box, Button, Typography } from '@mui/material';

import { UserDto, UserUpdateDto } from '../../types/User.Types';
import TextInput from '../TextInput/TextInput';
import { userUpdateValidator } from '../../utils/validationHelper';

type UserFormProps = {
	myData: UserDto;
	updateUser: (user: UserUpdateDto) => void;
};

const MyDataForm: FC<UserFormProps> = ({ myData, updateUser }) => (
	<Form
		initialValues={myData}
		onSubmit={async (values: UserUpdateDto) => {
			updateUser(values);
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
					id="firstName"
					label="First name"
					name="firstName"
					required
				/>
				<TextInput id="lastName" label="Last name" name="lastName" required />
				<TextInput
					id="phoneNumber"
					label="Phone number"
					name="phoneNumber"
					required
				/>
				<TextInput
					id="password"
					label="New password"
					name="password"
					type="password"
				/>
				<Button type="submit">Save</Button>
			</Box>
		)}
	/>
);

export default MyDataForm;
