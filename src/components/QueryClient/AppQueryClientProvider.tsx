import { PropsWithChildren, useContext } from 'react';
import { AlertContext, AlertContextValue } from '../UI/Alerts/AlertProvider';
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query';
import { match, P } from 'ts-pattern';
import { NoAlertError } from '../../error/NoAlertError';
import { constVoid } from 'fp-ts/es6/function';
import { QueryErrorSupportProvider } from './QueryErrorSupportProvider';
import { QueryErrorSupportHandler } from './QueryErrorSupportHandler';

const concatenateMessage = (error: Error): string => {
	let message: string = error.message;
	let baseError = error;
	while (baseError.cause !== undefined) {
		baseError = baseError.cause;
		message = `${message}; ${baseError.message}`;
	}
	return message;
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
				(e) =>
					alertContext.addAlert(
						'error',
						concatenateMessage(e as Error)
					)
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
