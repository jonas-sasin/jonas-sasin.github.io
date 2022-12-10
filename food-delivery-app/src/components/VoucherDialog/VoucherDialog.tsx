import { Box, Button, Dialog, DialogContent } from '@mui/material';
import { FC } from 'react';
import { Form } from 'react-final-form';

import { VoucherDialogProps, VoucherDto } from '../../types/Payment.Types';
import { voucherValidator } from '../../utils/validationHelper';
import TextInput from '../TextInput/TextInput';

const VoucherDialog: FC<VoucherDialogProps> = ({
	userId,
	user,
	voucherDialogOpened,
	handleCloseVoucherDialog,
	createVoucher
}) => (
	<Dialog open={voucherDialogOpened} onClose={handleCloseVoucherDialog}>
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
				onSubmit={async (values: VoucherDto) => {
					values.user = user;
					createVoucher(values);
					handleCloseVoucherDialog();
				}}
				validate={values => voucherValidator(values)}
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
							id="voucherNumber"
							label="Voucher number"
							name="voucherNumber"
							type="voucherNumber"
						/>
						<Button type="submit">Create</Button>
						<Button onClick={handleCloseVoucherDialog}>Cancel</Button>
					</Box>
				)}
			/>
		</DialogContent>
	</Dialog>
);

export default VoucherDialog;
