import { CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Content } from './Content';
import { AlertProvider } from './UI/Alerts/AlertProvider';
import { AppQueryAndErrorHandlingProvider } from './QueryClient/AppQueryAndErrorHandlingProvider';
import { ConfirmDialogProvider } from './UI/ConfirmDialog/ConfirmDialogProvider';

export const App = () => (
	<AlertProvider>
		<AppQueryAndErrorHandlingProvider>
			<ConfirmDialogProvider>
				<BrowserRouter basename="/">
					<CssBaseline />
					<Navbar />
					<Content />
				</BrowserRouter>
			</ConfirmDialogProvider>
		</AppQueryAndErrorHandlingProvider>
	</AlertProvider>
);
