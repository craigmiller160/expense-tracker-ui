import { CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from './Navbar';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Content } from './Content';

const queryClient = new QueryClient();

export const App = () => (
	<QueryClientProvider client={queryClient}>
		<BrowserRouter basename="/">
			<CssBaseline />
			<Navbar />
			<Content />
		</BrowserRouter>
	</QueryClientProvider>
);
