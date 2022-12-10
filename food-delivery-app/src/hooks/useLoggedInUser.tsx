import {
	createContext,
	Dispatch,
	FC,
	PropsWithChildren,
	SetStateAction,
	useContext,
	useEffect,
	useState
} from 'react';

import { UserDto } from '../types/User.Types';

type UserState = [UserDto | null, Dispatch<SetStateAction<UserDto | null>>];

const UserContext = createContext<UserState>(undefined as never);

const getInitialState = (): UserDto => {
	const user = localStorage.getItem('auth');
	return user ? JSON.parse(user) : null;
};

export const UserProvider: FC<PropsWithChildren> = ({ children }) => {
	const userState = useState<UserDto | null>(getInitialState());
	const [user, setUser] = userState;
	useEffect(() => {
		if (user !== null) {
			localStorage.setItem('auth', JSON.stringify(user));
		} else {
			localStorage.removeItem('auth');
		}
	}, [user]);

	const storageEventHandler = (e: StorageEvent) => {
		if (e.key === 'auth') {
			if (e.newValue === null) {
				setUser(null);
			} else {
				setUser(JSON.parse(e.newValue));
			}
		}
	};
	useEffect(() => {
		window.addEventListener('storage', e => storageEventHandler(e));
		return () => {
			window.removeEventListener('storage', e => storageEventHandler(e));
		};
	}, []);
	return (
		<UserContext.Provider value={userState}>{children}</UserContext.Provider>
	);
};

export const useUser = () => useContext(UserContext);

// Hook providing logged in user information
const useLoggedInUser = (): UserDto | undefined => {
	const [user] = useContext(UserContext);
	if (user === null) {
		return undefined;
	}
	return user;
};

export default useLoggedInUser;
