import { CssBaseline } from '@mui/material';
import { Navbar } from './Navbar';
import { Content } from './Content';
import { AlertProvider } from './UI/Alerts/AlertProvider';
import { ConfirmDialogProvider } from './UI/ConfirmDialog/ConfirmDialogProvider';
import { ConfirmDialog } from './UI/ConfirmDialog';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from './ErrorBoundary';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			cacheTime: 0
		}
	}
});

export const App = () => (
	<AlertProvider>
		<ErrorBoundary>
			<QueryClientProvider client={queryClient}>
				<ConfirmDialogProvider>
					<LocalizationProvider dateAdapter={AdapterDateFns}>
						<CssBaseline />
						<Navbar />
						<Content />
					</LocalizationProvider>
					<ConfirmDialog />
				</ConfirmDialogProvider>
			</QueryClientProvider>
		</ErrorBoundary>
	</AlertProvider>
);
