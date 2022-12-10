import { useEffect } from 'react';

const usePageTitle = (title: string) => {
	useEffect(() => {
		document.title = `${title} | FoodDelivery`;
	}, [title]);
};

export default usePageTitle;
