import { PropsWithChildren, useContext } from 'react';
import { AlertContext, AlertContextValue } from './UI/Alerts/AlertProvider';
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query';
import { match, P } from 'ts-pattern';

const concatenateMessage = (error: Error): string => {
	let message: string = error.message;
	let baseError = error;
	while (baseError.cause !== undefined) {
		baseError = baseError.cause;
		message = `${message}; ${baseError.message}`;
	}
	return message;
};

const createErrorHandler =
	(alertContext: AlertContextValue) => (error: unknown) => {
		match(error)
			.with(P.instanceOf(Error), (e) =>
				alertContext.addAlert('error', concatenateMessage(e))
			)
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
		<QueryClientProvider client={queryClient}>
			{props.children}
		</QueryClientProvider>
	);
};
