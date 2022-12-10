import { AppBar, Box, Button, Container, Toolbar } from '@mui/material';
import { Link } from 'react-router-dom';
import { FC, useCallback } from 'react';
import { useQueryClient } from 'react-query';

import { useUser } from '../../hooks/useLoggedInUser';
import { Role } from '../../types/User.Types';
import { useLogout } from '../../hooks/useApi';

const NavBar: FC = () => {
	const [user, setUser] = useUser();
	const qc = useQueryClient();
	const postLogout = useLogout(qc);

	const logout = useCallback(async () => {
		await postLogout.mutateAsync();
		setUser(null);
	}, []);

	return (
		<AppBar sx={{ position: 'sticky', top: 0 }}>
			<Container maxWidth="lg">
				<Toolbar disableGutters sx={{ gap: 2 }}>
					<Button component={Link} to="/">
						Home
					</Button>
					{!user ? (
						<>
							<Box sx={{ flexGrow: 1 }} />
							<Button component={Link} to="/login">
								Login
							</Button>
						</>
					) : (
						<>
							<Button component={Link} to="/restaurants">
								Restaurants
							</Button>
							{user.role === Role.Admin && (
								<>
									<Button component={Link} to="/categories">
										Categories
									</Button>
									<Button component={Link} to="/users">
										Users
									</Button>
								</>
							)}
							<Button component={Link} to="/orders">
								Orders
							</Button>
							<Box sx={{ flexGrow: 1 }} />
							<Button component={Link} to="/me">
								{user.phoneNumber}
							</Button>
							<Button onClick={() => logout()} component={Link} to="/">
								Logout
							</Button>
						</>
					)}
				</Toolbar>
			</Container>
		</AppBar>
	);
};

export default NavBar;
