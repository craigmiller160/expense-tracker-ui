import { CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from './Navbar';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

export const App = () => (
	<QueryClientProvider client={queryClient}>
		<BrowserRouter basename="/expense-tracker">
			<CssBaseline />
			<Navbar />
		</BrowserRouter>
	</QueryClientProvider>
);
