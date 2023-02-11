import { CssBaseline } from '@mui/material';
import { Navbar } from './Navbar';
import { Content } from './Content';
import { ConfirmDialogProvider } from './UI/ConfirmDialog/ConfirmDialogProvider';
import { ConfirmDialog } from './UI/ConfirmDialog';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { alertManager } from './UI/Alerts/AlertManager';
import { isAxiosError } from '@craigmiller160/ajax-api';
import { ErrorResponse, isErrorResponse } from '../types/error';

type CombinedErrorValues = {
	readonly message: string;
	readonly status?: number;
	readonly errorResponse?: ErrorResponse;
};

// TODO move to file
const getCombinedErrorValues = (error: Error): CombinedErrorValues => {
	const messages: string[] = [];
	let baseError: Error | undefined = error;
	while (baseError != undefined) {
		messages.push(baseError.message);
		if (isAxiosError(baseError)) {
			const status = baseError.response?.status ?? -1;
			const body = baseError.response?.data;
			const errorResponse: ErrorResponse | undefined = isErrorResponse(
				body
			)
				? body
				: undefined;
			return {
				message: messages.join('; '),
				status,
				errorResponse
			};
		}
		baseError = baseError.cause as Error | undefined;
	}
	return {
		message: messages.join('; ')
	};
};

const onError = (error: unknown) => {
	if (error instanceof Error) {
		const combinedValues = getCombinedErrorValues(error);
		if (combinedValues.status === 400 && !!combinedValues.errorResponse) {
			alertManager.addAlert(
				'error',
				combinedValues.errorResponse.message
			);
		} else {
			alertManager.addAlert('error', combinedValues.message);
		}
	}
};

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			cacheTime: 0,
			onError
		},
		mutations: {
			onError
		}
	}
});

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
