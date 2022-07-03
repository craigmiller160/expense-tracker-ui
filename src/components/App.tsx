import { CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Content } from './Content';
import { AlertProvider } from './UI/Alerts/AlertProvider';
import { AppQueryAndErrorHandlingProvider } from './QueryClient/AppQueryAndErrorHandlingProvider';
import { ConfirmDialogProvider } from './UI/ConfirmDialog/ConfirmDialogProvider';
import { ConfirmDialog } from './UI/ConfirmDialog';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export const App = () => (
	<AlertProvider>
		<AppQueryAndErrorHandlingProvider>
			<ConfirmDialogProvider>
				<BrowserRouter basename="/">
					<LocalizationProvider dateAdapter={AdapterDateFns}>
						<CssBaseline />
						<Navbar />
						<Content />
					</LocalizationProvider>
				</BrowserRouter>
				<ConfirmDialog />
			</ConfirmDialogProvider>
		</AppQueryAndErrorHandlingProvider>
	</AlertProvider>
);
