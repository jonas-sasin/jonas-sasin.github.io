import { FC, useCallback, useEffect, useState } from 'react';
import { Container, Grid, Typography } from '@mui/material';

import usePageTitle from '../hooks/usePageTitle';
import { useGetAllUsers } from '../hooks/useApi';
import UsersTable from '../components/User/UsersTable';
import { UserDto } from '../types/User.Types';

const UserManagement: FC = () => {
	usePageTitle('Manage users');
	const [users, setUsers] = useState<UserDto[] | undefined>();
	const usersResult = useGetAllUsers();

	useEffect(() => {
		setUsers(usersResult.data ? usersResult.data.data : undefined);
	}, [usersResult]);

	const getAdmins = useCallback(
		(users: UserDto[] | undefined) =>
			users?.filter(user => user.role === 'Admin'),
		[]
	);

	const getUsers = useCallback(
		(users: UserDto[] | undefined) =>
			users?.filter(user => user.role === 'User'),
		[]
	);

	return (
		<Container maxWidth="md">
			<Grid container rowSpacing={8}>
				<Grid item xs={12}>
					<Typography variant="h3">Admins</Typography>
					<UsersTable users={getAdmins(users)} />
				</Grid>
				<Grid item xs={12}>
					<Typography variant="h3">Users</Typography>
					<UsersTable users={getUsers(users)} />
				</Grid>
			</Grid>
		</Container>
	);
};

export default UserManagement;
