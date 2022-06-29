import { PropsWithChildren, useContext } from 'react';
import { AlertContext, AlertContextValue } from '../UI/Alerts/AlertProvider';
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query';
import { match, P } from 'ts-pattern';
import { NoAlertError } from '../../error/NoAlertError';
import {
	QueryErrorSupportContext,
	QueryErrorSupportValue
} from './QueryErrorSupportProvider';
import { isAxiosError } from '@craigmiller160/ajax-api';
import { NoAlertOrStatusHandlingError } from '../../error/NoAlertOrStatusHandlingError';
import { constVoid } from 'fp-ts/es6/function';

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

const handleResponseStatus = (
	queryErrorSupport: QueryErrorSupportValue,
	error: Error
) => {
	const status = findResponseStatus(error);
	if (status === 401) {
		queryErrorSupport.setHasUnauthorizedError(true);
	}
};

const handleErrorWithAlert = (
	alertContext: AlertContextValue,
	queryErrorSupport: QueryErrorSupportValue,
	error: Error
) => {
	handleResponseStatus(queryErrorSupport, error);
	alertContext.addAlert('error', concatenateMessage(error));
};

const createErrorHandler =
	(
		alertContext: AlertContextValue,
		queryErrorSupport: QueryErrorSupportValue
	) =>
	(error: unknown) => {
		match(error)
			.with(
				P.intersection(
					P.not(P.instanceOf(NoAlertError)),
					P.not(P.instanceOf(NoAlertOrStatusHandlingError)),
					P.instanceOf(Error)
				),
				(e) =>
					handleErrorWithAlert(
						alertContext,
						queryErrorSupport,
						e as Error
					)
			)
			.with(P.instanceOf(NoAlertOrStatusHandlingError), () => constVoid())
			.with(P.instanceOf(NoAlertError), (e) =>
				handleResponseStatus(queryErrorSupport, e as Error)
			)
			.otherwise(() =>
				alertContext.addAlert('error', `Unknown Error: ${error}`)
			);
	};

export const AppQueryClientProvider = (props: PropsWithChildren) => {
	const alertContext = useContext(AlertContext);
	const queryErrorSupport = useContext(QueryErrorSupportContext);
	const queryClient = new QueryClient({
		queryCache: new QueryCache({
			onError: createErrorHandler(alertContext, queryErrorSupport)
		})
	});
	return (
		<QueryClientProvider client={queryClient}>
			{props.children}
		</QueryClientProvider>
	);
};
