import { CssBaseline } from '@mui/material';
import { Navbar } from './Navbar';
import { Content } from './Content';
import { ConfirmDialogProvider } from './UI/ConfirmDialog/ConfirmDialogProvider';
import { ConfirmDialog } from './UI/ConfirmDialog';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../ajaxapi/query/queryClient';

export const App = () => (
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
);
