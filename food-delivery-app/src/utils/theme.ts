import { createTheme } from '@mui/material';

const theme = createTheme({
	palette: {
		primary: { main: 'rgb(139,180,179)' },
		mode: 'dark'
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				'body, #root': {
					display: 'flex',
					flexDirection: 'column',
					minHeight: '100vh'
				}
			}
		}
	}
});

export default theme;
