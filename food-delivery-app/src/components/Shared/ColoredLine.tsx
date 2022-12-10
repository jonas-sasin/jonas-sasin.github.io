import { FC } from 'react';

type LineProps = {
	color: string;
};
const ColoredLine: FC<LineProps> = ({ color }) => (
	<hr
		style={{
			color,
			backgroundColor: color,
			height: 5
		}}
	/>
);

export default ColoredLine;
