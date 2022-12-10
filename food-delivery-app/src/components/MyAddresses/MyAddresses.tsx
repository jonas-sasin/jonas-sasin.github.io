import { FC, useCallback, useEffect, useState } from 'react';
import {
	Button,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
	Typography
} from '@mui/material';
import { useQueryClient } from 'react-query';

import {
	AddressDto,
	AddressUpsertDto,
	MyAddressesProps
} from '../../types/Address.Types';
import {
	useDeleteAddress,
	useGetAddresses,
	usePostAddress,
	useUpdateAddress
} from '../../hooks/useApi';
import AddressDialog from '../AddressDialog/AddressDialog';
import { AppAlertTypes } from '../../types/AppAlert.Types';
import { useAlert } from '../../hooks/useAppAlert';

const MyAddresses: FC<MyAddressesProps> = ({ userId }) => {
	const [, setAlertOptions] = useAlert();
	const { isError, data, error } = useGetAddresses();
	const qc = useQueryClient();
	const [addressDialogOpened, setAddressDialogOpened] = useState(false);
	const addressDeleteCall = useDeleteAddress(qc);
	const addressCreateCall = usePostAddress(qc);
	const addressUpdateCall = useUpdateAddress(qc);
	const [myAddresses, setMyAddresses] = useState<AddressDto[] | undefined>();
	const [selectedAddress, setSelectedAddress] = useState<
		AddressDto | undefined
	>();

	const openAddressDialog = useCallback((address: AddressDto | undefined) => {
		setAddressDialogOpened(true);
		setSelectedAddress(address);
	}, []);

	const handleCloseAddressDialog = useCallback(() => {
		setAddressDialogOpened(false);
		setSelectedAddress(undefined);
	}, []);

	const updateAddress = useCallback(async (address: AddressUpsertDto) => {
		await addressUpdateCall.mutateAsync(address);
	}, []);

	const createAddress = useCallback(async (address: AddressUpsertDto) => {
		await addressCreateCall.mutateAsync(address);
	}, []);

	const deleteAddress = useCallback(async (addressId: string) => {
		await addressDeleteCall.mutateAsync(addressId);
	}, []);

	useEffect(() => {
		setMyAddresses(data ? data.data : undefined);
	}, [data]);

	useEffect(() => {
		if (isError) {
			setAlertOptions({
				showAlert: true,
				alertType: AppAlertTypes.Error,
				alertMessage: error?.message
			});
		}
	}, [isError]);

	return (
		<>
			<AddressDialog
				userId={userId}
				address={selectedAddress}
				addressDialogOpened={addressDialogOpened}
				handleCloseAddressDialog={handleCloseAddressDialog}
				updateAddress={updateAddress}
				createAddress={createAddress}
			/>
			<Typography variant="h4" component="h2" textAlign="center" mb={3}>
				My addresses
			</Typography>

			<TableContainer component={Paper}>
				<Table aria-label="simple table">
					<TableBody>
						{myAddresses?.map(row => (
							<TableRow
								key={row.id}
								sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
							>
								<TableCell scope="row">{`${row.street} ${row.number}, ${
									row.town
								}, ${row.zipCode}, ${row.flatNumber ?? ''} ${
									row.note ?? ''
								}`}</TableCell>
								<TableCell component="th" scope="row" align="right">
									<Button onClick={() => openAddressDialog(row)}>Update</Button>
									<Button onClick={() => deleteAddress(row.id)}>Delete</Button>
								</TableCell>
							</TableRow>
						))}
						<TableRow
							sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
						>
							<TableCell component="th" scope="row" align="left">
								<Button onClick={() => openAddressDialog(undefined)}>
									Add new
								</Button>
							</TableCell>
							<TableCell component="th" scope="row" />
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
};

export default MyAddresses;
