import {
	CategorizeTransactionsRequest,
	DATE_FORMAT,
	SearchTransactionsRequest,
	SearchTransactionsResponse,
	TransactionAndCategory
} from '../../types/transactions';
import * as Time from '@craigmiller160/ts-functions/es/Time';
import qs from 'qs';
import { pipe } from 'fp-ts/es6/function';
import * as Option from 'fp-ts/es6/Option';
import { expenseTrackerApi, getData } from './AjaxApi';

const formatSearchDate = Time.format(DATE_FORMAT);

const handleOptionalValue = <T>(
	value: T | undefined,
	formatter: (v: T) => string
): string | undefined =>
	pipe(
		Option.fromNullable(value),
		Option.map(formatter),
		Option.getOrElse((): string | undefined => undefined)
	);

export const requestToQuery = (request: SearchTransactionsRequest): string =>
	qs.stringify({
		...request,
		startDate: handleOptionalValue(request.startDate, formatSearchDate),
		endDate: handleOptionalValue(request.endDate, formatSearchDate),
		categoryIds: handleOptionalValue(request.categoryIds, (ids) =>
			ids.join(',')
		)
	});

export const searchForTransactions = (
	request: SearchTransactionsRequest
): Promise<SearchTransactionsResponse> => {
	const query = requestToQuery(request);
	return expenseTrackerApi
		.get<SearchTransactionsResponse>({
			uri: `/transactions?${query}`,
			errorCustomizer: 'Error searching for transactions'
		})
		.then(getData);
};

export const categorizeTransactions = (
	transactionsAndCategories: ReadonlyArray<TransactionAndCategory>
): Promise<unknown> =>
	expenseTrackerApi.post<CategorizeTransactionsRequest, unknown>({
		uri: '/transactions/categorize',
		errorCustomizer: 'Error categorizing transactions',
		body: {
			transactionsAndCategories
		}
	});
