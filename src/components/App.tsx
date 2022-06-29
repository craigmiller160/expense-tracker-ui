import { CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Content } from './Content';
import { AlertProvider } from './UI/Alerts/AlertProvider';
import { AppQueryClientProvider } from './QueryClient/AppQueryClientProvider';

export const App = () => (
	<AlertProvider>
		<AppQueryClientProvider>
			<BrowserRouter basename="/">
				<CssBaseline />
				<Navbar />
				<Content />
			</BrowserRouter>
		</AppQueryClientProvider>
	</AlertProvider>
);
