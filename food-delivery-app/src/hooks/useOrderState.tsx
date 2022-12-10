import {
	createContext,
	Dispatch,
	FC,
	PropsWithChildren,
	SetStateAction,
	useContext,
	useState
} from 'react';

import { OrderItemUpsertDto } from '../types/Order.Types';

type OrderState = [
	OrderItemUpsertDto[],
	Dispatch<SetStateAction<OrderItemUpsertDto[]>>
];
const OrderContext = createContext<OrderState>(undefined as never);

export const OrderStateProvider: FC<PropsWithChildren> = ({ children }) => {
	const orderItems = useState<OrderItemUpsertDto[]>([]);
	return (
		<OrderContext.Provider value={orderItems}>{children}</OrderContext.Provider>
	);
};

export const useOrderState = () => useContext(OrderContext);
