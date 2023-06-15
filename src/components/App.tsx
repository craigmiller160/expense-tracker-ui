import { CssBaseline } from '@mui/material';
import { Navbar } from './Navbar';
import { Content } from './Content';
import { ConfirmDialogProvider } from './UI/ConfirmDialog/ConfirmDialogProvider';
import { ConfirmDialog } from './UI/ConfirmDialog';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { newQueryClient } from '../ajaxapi/query/queryClient';

const defaultQueryClient = newQueryClient();

type Props = {
	readonly queryClient?: QueryClient;
};

export const App = (props: Props) => {
	const queryClient = props.queryClient ?? defaultQueryClient;
	return (
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
};
