import { PropsWithChildren, useContext } from 'react';
import { AlertContext, AlertContextValue } from '../UI/Alerts/AlertProvider';
import {
	MutationCache,
	QueryCache,
	QueryClient,
	QueryClientProvider
} from 'react-query';
import { match, P } from 'ts-pattern';
import { NoAlertError } from '../../error/NoAlertError';
import {
	QueryErrorSupportContext,
	QueryErrorSupportValue
} from './QueryErrorSupportProvider';
import { isAxiosError } from '@craigmiller160/ajax-api';
import { NoAlertOrStatusHandlingError } from '../../error/NoAlertOrStatusHandlingError';
import { constVoid } from 'fp-ts/es6/function';
import { ErrorResponse, isErrorResponse } from '../../types/error';

interface CombinedErrorValues {
	readonly message: string;
	readonly status?: number;
	readonly errorResponse?: ErrorResponse;
}

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
		baseError = baseError.cause;
	}
	return {
		message: messages.join('; ')
	};
};

const specialResponseStatusAction = (
	queryErrorSupport: QueryErrorSupportValue,
	status?: number
) => {
	if (status === 401) {
		queryErrorSupport.setHasUnauthorizedError(true);
	}
};

const handleErrorWithAlert = (
	alertContext: AlertContextValue,
	queryErrorSupport: QueryErrorSupportValue,
	error: Error
) => {
	const combinedValues = getCombinedErrorValues(error);
	specialResponseStatusAction(queryErrorSupport, combinedValues.status);
	if (combinedValues.status === 400 && !!combinedValues.errorResponse) {
		alertContext.addAlert('error', combinedValues.errorResponse.message);
	} else {
		alertContext.addAlert('error', combinedValues.message);
	}
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
				specialResponseStatusAction(
					queryErrorSupport,
					getCombinedErrorValues(e as Error).status
				)
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
		}),
		mutationCache: new MutationCache({
			onError: createErrorHandler(alertContext, queryErrorSupport)
		}),
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false
			}
		}
	});
	return (
		<QueryClientProvider client={queryClient}>
			{props.children}
		</QueryClientProvider>
	);
};
