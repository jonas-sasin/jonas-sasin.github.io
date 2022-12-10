import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { FC, PropsWithChildren } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';

type Props = PropsWithChildren<{
	onClick: () => void;
}>;

const ConfirmDeleteDialog: FC<Props> = ({ onClick, children }) => {
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleCancel = () => {
		setOpen(false);
	};

	const handleOk = () => {
		onClick();
		setOpen(false);
	};

	return (
		<>
			<Button onClick={handleClickOpen} variant="contained">
				<DeleteIcon />
			</Button>
			<Dialog
				open={open}
				onClose={handleCancel}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{children}</DialogTitle>
				<DialogActions>
					<Button onClick={handleOk}>Ok</Button>
					<Button onClick={handleCancel}>Cancel</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default ConfirmDeleteDialog;
