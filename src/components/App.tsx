import { CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from './Navbar';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Content } from './Content';
import { AlertProvider } from './UI/Alerts/AlertProvider';

const queryClient = new QueryClient();

export const App = () => (
	<AlertProvider>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter basename="/">
				<CssBaseline />
				<Navbar />
				<Content />
			</BrowserRouter>
		</QueryClientProvider>
	</AlertProvider>
);
