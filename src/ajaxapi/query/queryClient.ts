import { ErrorResponse, isErrorResponse } from '../../types/error';
import { isAxiosError } from '@craigmiller160/ajax-api';
import { alertManager } from '../../components/UI/Alerts/AlertManager';
import { QueryClient } from '@tanstack/react-query';

type CombinedErrorValues = {
	readonly message: string;
	readonly status?: number;
	readonly errorResponse?: ErrorResponse;
};

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

export const newQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
				cacheTime: 0,
				staleTime: 300_000,
				onError
			},
			mutations: {
				onError
			}
		}
	});
