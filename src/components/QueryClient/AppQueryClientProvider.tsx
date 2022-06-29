import { PropsWithChildren, useContext } from 'react';
import { AlertContext, AlertContextValue } from '../UI/Alerts/AlertProvider';
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query';
import { match, P } from 'ts-pattern';
import { NoAlertError } from '../../error/NoAlertError';
import { constVoid } from 'fp-ts/es6/function';
import { QueryErrorSupportProvider } from './QueryErrorSupportProvider';
import { QueryErrorSupportHandler } from './QueryErrorSupportHandler';
import { AxiosError } from 'axios';
import { isAxiosError } from '@craigmiller160/ajax-api';

const concatenateMessage = (error: Error): string => {
	const messages: string[] = [];
	let baseError: Error | undefined = error;
	while (baseError !== undefined) {
		messages.push(baseError.message);
		baseError = baseError.cause;
	}
	return messages.join('; ');
};

const findResponseStatus = (error: Error): number => {
	let baseError: Error | undefined = error;
	while (baseError !== undefined) {
		if (isAxiosError(baseError)) {
			return baseError.response?.status ?? -1;
		}
		baseError = baseError.cause;
	}
	return -1;
};

const handleErrorType = (alertContext: AlertContextValue, error: Error) => {
	const status = findResponseStatus(error);
	alertContext.addAlert('error', concatenateMessage(error));
};

// TODO need to handle 401 errors
const createErrorHandler =
	(alertContext: AlertContextValue) => (error: unknown) => {
		match(error)
			.with(
				P.intersection(
					P.not(P.instanceOf(NoAlertError)),
					P.instanceOf(Error)
				),
				(e) => handleErrorType(alertContext, e as Error)
			)
			.with(P.instanceOf(NoAlertError), () => constVoid())
			.otherwise(() =>
				alertContext.addAlert('error', `Unknown Error: ${error}`)
			);
	};

export const AppQueryClientProvider = (props: PropsWithChildren) => {
	const alertContext = useContext(AlertContext);
	const queryClient = new QueryClient({
		queryCache: new QueryCache({
			onError: createErrorHandler(alertContext)
		})
	});
	return (
		<QueryErrorSupportProvider>
			<QueryClientProvider client={queryClient}>
				<QueryErrorSupportHandler>
					{props.children}
				</QueryErrorSupportHandler>
			</QueryClientProvider>
		</QueryErrorSupportProvider>
	);
};
