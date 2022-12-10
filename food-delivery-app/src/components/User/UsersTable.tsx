import { FC, useCallback, useState } from 'react';
import {
	Button,
	Paper,
	styled,
	Table,
	TableBody,
	TableCell,
	tableCellClasses,
	TableContainer,
	TableHead,
	TableRow,
	Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Edit } from '@mui/icons-material';
import { useQueryClient } from 'react-query';

import { UserDto, UserUpdateDto } from '../../types/User.Types';
import { useDeleteUser, useUpdateUser } from '../../hooks/useApi';

import UserDialog from './UserDialog';

export type CategoryTableProps = {
	users: UserDto[] | undefined;
};
const UsersTable: FC<CategoryTableProps> = ({ users }) => {
	const qc = useQueryClient();
	const deleteUser = useDeleteUser(qc);
	const updateUserCall = useUpdateUser(qc);
	const [openUserDialog, setOpenUserDialog] = useState(false);
	const [selectedUser, setSelectedUser] = useState<UserDto | undefined>();

	const StyledTableCell = styled(TableCell)(({ theme }) => ({
		[`&.${tableCellClasses.head}`]: {
			backgroundColor: theme.palette.common.black,
			color: theme.palette.common.white
		},
		[`&.${tableCellClasses.body}`]: {
			fontSize: 14
		}
	}));

	const onDeleteClick = useCallback(async (id: string) => {
		await deleteUser.mutateAsync(id);
	}, []);

	const onUpdateClick = useCallback((user: UserDto) => {
		setSelectedUser(user);
		setOpenUserDialog(true);
	}, []);

	const handleCloseDialog = useCallback(() => {
		setOpenUserDialog(false);
	}, []);

	const updateUser = useCallback(async (updatedUser: UserUpdateDto) => {
		await updateUserCall.mutateAsync(updatedUser);
	}, []);

	return (
		<TableContainer component={Paper}>
			<UserDialog
				user={selectedUser}
				openUserDialog={openUserDialog}
				handleCloseDialog={handleCloseDialog}
				updateUser={updateUser}
			/>
			<Table aria-label="simple table">
				<TableHead>
					<TableRow>
						<StyledTableCell>
							<Typography variant="h6">Phone number</Typography>
						</StyledTableCell>
						<StyledTableCell>
							<Typography variant="h6">User name</Typography>
						</StyledTableCell>
						<StyledTableCell />
					</TableRow>
				</TableHead>
				<TableBody>
					{users?.map(user => (
						<TableRow
							key={user.id}
							sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
						>
							<TableCell component="th" scope="row">
								{user.phoneNumber}
							</TableCell>
							<TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
							<TableCell style={{ width: 175 }} align="center">
								<Button onClick={() => onUpdateClick(user)}>
									<Edit />
								</Button>
								<Button onClick={() => onDeleteClick(user.id)}>
									<DeleteIcon />
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default UsersTable;
