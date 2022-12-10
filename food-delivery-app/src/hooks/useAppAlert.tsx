import {
	createContext,
	Dispatch,
	FC,
	PropsWithChildren,
	SetStateAction,
	useContext,
	useState
} from 'react';

import { AppAlertOptions } from '../types/AppAlert.Types';

type AlertState = [AppAlertOptions, Dispatch<SetStateAction<AppAlertOptions>>];
const AlertContext = createContext<AlertState>(undefined as never);

export const AlertProvider: FC<PropsWithChildren> = ({ children }) => {
	const appAlertOptions = useState<AppAlertOptions>({
		showAlert: false
	});
	return (
		<AlertContext.Provider value={appAlertOptions}>
			{children}
		</AlertContext.Provider>
	);
};

export const useAlert = () => useContext(AlertContext);
