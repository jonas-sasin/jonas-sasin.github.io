import { FC } from 'react';

import usePageTitle from '../hooks/usePageTitle';

const NotFound: FC = () => {
	usePageTitle('Error');
	return <>Page not found</>;
};

export default NotFound;
