import { FC } from 'react';
import { Star, StarBorder } from '@mui/icons-material';

import { StarProps } from '../../types/Rating.Types';

const ReviewStars: FC<StarProps> = ({ stars }) => (
	<>
		{[...Array(5).keys()].map(i =>
			i < stars ? (
				<Star key={i} color="primary" />
			) : (
				<StarBorder key={i} color="primary" />
			)
		)}
	</>
);

export default ReviewStars;
