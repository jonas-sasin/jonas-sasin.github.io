import { FC, useCallback, useEffect, useState } from 'react';
import {
	Button,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography
} from '@mui/material';
import { useQueryClient } from 'react-query';

import { MyVouchersProps, VoucherDto } from '../../types/Payment.Types';
import {
	useDeleteVoucher,
	useGetVouchers,
	usePostVoucher
} from '../../hooks/useApi';
import VoucherDialog from '../VoucherDialog/VoucherDialog';
import { useAlert } from '../../hooks/useAppAlert';
import { AppAlertTypes } from '../../types/AppAlert.Types';

const MyVouchers: FC<MyVouchersProps> = ({ userId, user }) => {
	const [, setAlertOptions] = useAlert();
	const qc = useQueryClient();
	const [myVouchers, setMyVouchers] = useState<VoucherDto[] | undefined>();
	const [voucherDialogOpened, setVoucherDialogOpened] = useState(false);
	const { isError, data, error } = useGetVouchers();
	const voucherDeleteCall = useDeleteVoucher(qc);
	const voucherCreateCall = usePostVoucher(qc);

	const handleOpenVoucherdDialog = useCallback(() => {
		setVoucherDialogOpened(true);
	}, []);

	const handleCloseVoucherDialog = useCallback(() => {
		setVoucherDialogOpened(false);
	}, []);

	const createVoucher = useCallback(async (voucher: VoucherDto) => {
		await voucherCreateCall.mutateAsync(voucher);
	}, []);

	const deleteVoucher = useCallback(async (voucherId: string) => {
		await voucherDeleteCall.mutateAsync(voucherId);
	}, []);

	useEffect(() => {
		setMyVouchers(data ? data.data : undefined);
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
			<VoucherDialog
				userId={userId}
				user={user}
				voucherDialogOpened={voucherDialogOpened}
				handleCloseVoucherDialog={handleCloseVoucherDialog}
				createVoucher={createVoucher}
			/>
			<Typography variant="h4" component="h2" textAlign="center" mb={3}>
				My vouchers
			</Typography>

			<TableContainer component={Paper}>
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>Voucher code</TableCell>
							<TableCell />
						</TableRow>
					</TableHead>
					<TableBody>
						{myVouchers?.map(row => (
							<TableRow
								key={row.id}
								sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
							>
								<TableCell scope="row">{row.voucherNumber}</TableCell>
								<TableCell component="th" scope="row" align="right">
									<Button onClick={() => deleteVoucher(row.id)}>Delete</Button>
								</TableCell>
							</TableRow>
						))}
						<TableRow
							sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
						>
							<TableCell component="th" scope="row" align="left">
								<Button onClick={handleOpenVoucherdDialog}>Create</Button>
							</TableCell>
							<TableCell component="th" scope="row" />
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
};

export default MyVouchers;
