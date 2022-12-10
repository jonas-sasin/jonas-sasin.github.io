import { FC, useCallback } from 'react';
import { Alert, Box, Collapse, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { AppAlertProps, AppAlertTypes } from '../../types/AppAlert.Types';

const AppAlert: FC<AppAlertProps> = ({
	showAlert,
	alertType = AppAlertTypes.Info,
	alertMessage = '',
	setAppAlertOptions
}) => {
	const closeAlert = useCallback(() => {
		setAppAlertOptions({ showAlert: false });
	}, []);

	return (
		<Box sx={{ width: '100%' }}>
			<Collapse in={showAlert}>
				<Alert
					action={
						<IconButton
							aria-label="close"
							color="inherit"
							size="small"
							onClick={closeAlert}
						>
							<CloseIcon fontSize="inherit" />
						</IconButton>
					}
					sx={{ mb: 2 }}
					variant="filled"
					severity={alertType}
				>
					{alertMessage}
				</Alert>
			</Collapse>
		</Box>
	);
};

export default AppAlert;
