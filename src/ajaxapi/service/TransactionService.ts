import {
	DATE_FORMAT,
	SearchTransactionsRequest
} from '../../types/transactions';
import * as Time from '@craigmiller160/ts-functions/es/Time';
import qs from 'qs';

const formatSearchDate = Time.format(DATE_FORMAT);

export const requestToQuery = (request: SearchTransactionsRequest): string =>
	qs.stringify({
		...request,
		startDate: request.startDate
			? formatSearchDate(request.startDate)
			: undefined,
		endDate: request.endDate ? formatSearchDate(request.endDate) : undefined
	});

// export const searchForTransactions = (
// 	request: SearchTransactionsRequest
// ): Promise<SearchTransactionsResponse> => {};
//
