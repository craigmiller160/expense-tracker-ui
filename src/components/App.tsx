import { CssBaseline } from '@mui/material';
import { Navbar } from './Navbar';
import { Content } from './Content';
import { AlertProvider } from './UI/Alerts/AlertProvider';
import { AppQueryAndErrorHandlingProvider } from './QueryClient/AppQueryAndErrorHandlingProvider';
import { ConfirmDialogProvider } from './UI/ConfirmDialog/ConfirmDialogProvider';
import { ConfirmDialog } from './UI/ConfirmDialog';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { KeycloakAuthProvider } from './KeycloakAuthProvider';

export const App = () => (
	<AlertProvider>
		<AppQueryAndErrorHandlingProvider>
			<ConfirmDialogProvider>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<KeycloakAuthProvider>
						<CssBaseline />
						<Navbar />
						<Content />
					</KeycloakAuthProvider>
				</LocalizationProvider>
				<ConfirmDialog />
			</ConfirmDialogProvider>
		</AppQueryAndErrorHandlingProvider>
	</AlertProvider>
);
