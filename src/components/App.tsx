import { CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Content } from './Content';
import { AlertProvider } from './UI/Alerts/AlertProvider';
import { AppQueryAndErrorHandlingProvider } from './QueryClient/AppQueryAndErrorHandlingProvider';

export const App = () => (
	<AlertProvider>
		<AppQueryAndErrorHandlingProvider>
			<BrowserRouter basename="/">
				<CssBaseline />
				<Navbar />
				<Content />
			</BrowserRouter>
		</AppQueryAndErrorHandlingProvider>
	</AlertProvider>
);
