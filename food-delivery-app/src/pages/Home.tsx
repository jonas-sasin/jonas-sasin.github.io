import { FC } from 'react';

import usePageTitle from '../hooks/usePageTitle';

const Home: FC = () => {
	usePageTitle('Home');
	return (
		<img
			className="home-image"
			src={require('../resources/stock_lunch.jpg')}
			alt="stock_image"
		/>
	);
};

export default Home;
