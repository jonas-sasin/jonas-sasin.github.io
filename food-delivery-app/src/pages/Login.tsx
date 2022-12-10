import { FC, FormEvent, useCallback, useState } from 'react';
import { Button, Paper, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import usePageTitle from '../hooks/usePageTitle';
import useField from '../hooks/useField';
import { useUser } from '../hooks/useLoggedInUser';
import { LoginDto } from '../types/User.Types';
import { useAlert } from '../hooks/useAppAlert';
import { AppAlertTypes } from '../types/AppAlert.Types';
import { useLogin, useSignUp } from '../hooks/useApi';

const Login: FC = () => {
	usePageTitle('Login');
	const navigate = useNavigate();
	const [, setAlertOptions] = useAlert();
	const singUpCall = useSignUp();
	const loginCall = useLogin();

	const [phoneNumber, phoneNumberProps] = useField('phoneNumber', true);
	const [password, passwdProps] = useField('password', true);
	const [isSignUp, setSignUp] = useState(false);
	const [, setUser] = useUser();

	const login = useCallback(async (loginData: LoginDto) => {
		try {
			const user = await loginCall.mutateAsync(loginData);
			setUser(user);
			navigate('/');
		} catch (error) {
			setAlertOptions({
				showAlert: true,
				alertType: AppAlertTypes.Error,
				alertMessage: 'Invalid credentials'
			});
		}
	}, []);

	const signUp = useCallback(async (loginData: LoginDto) => {
		try {
			const user = await singUpCall.mutateAsync(loginData);
			setUser(user);
			navigate('/');
		} catch (error) {
			setAlertOptions({
				showAlert: true,
				alertType: AppAlertTypes.Error,
				alertMessage: 'Invalid signup options or user exists'
			});
		}
	}, []);

	return (
		<Paper
			component="form"
			onSubmit={(e: FormEvent) => {
				e.preventDefault();
				isSignUp
					? signUp({ phoneNumber, password })
					: login({
							phoneNumber,
							password
					  });
			}}
			sx={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				p: 4,
				gap: 2
			}}
		>
			<Typography variant="h4" component="h2" textAlign="center" mb={3}>
				Login
			</Typography>
			<Typography variant="caption">Enter your phone number</Typography>
			<TextField label="Phone number" {...phoneNumberProps} />
			<TextField type="password" label="Password" {...passwdProps} />
			<Button type="submit" sx={{ alignSelf: 'flex-end', mt: 2 }}>
				Login
			</Button>
			<Button
				type="submit"
				sx={{ alignSelf: 'flex-end', mt: 2 }}
				onClick={() => setSignUp(true)}
			>
				Sign up
			</Button>
		</Paper>
	);
};

export default Login;
