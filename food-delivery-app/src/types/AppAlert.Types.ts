export enum AppAlertTypes {
	Error = 'error',
	Success = 'success',
	Warning = 'warning',
	Info = 'info'
}

export type AppAlertOptions = {
	showAlert: boolean;
	alertType?: AppAlertTypes;
	alertMessage?: string;
};

export type AppAlertSetter = {
	setAppAlertOptions: (e: AppAlertOptions) => void;
};

export type AppAlertProps = AppAlertOptions & AppAlertSetter;
