import { ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import theme from './utils/theme';
import { UserProvider } from './hooks/useLoggedInUser';
import { AlertProvider } from './hooks/useAppAlert';
import Layout from './pages/Layout';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 0,
			refetchOnWindowFocus: false,
			staleTime: 3600000
		}
	}
});
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const App = () => (
	<QueryClientProvider client={queryClient}>
		<UserProvider>
			<AlertProvider>
				<ThemeProvider theme={theme}>
					<Layout />
					<ReactQueryDevtools />
				</ThemeProvider>
			</AlertProvider>
		</UserProvider>
	</QueryClientProvider>
);

export default App;
