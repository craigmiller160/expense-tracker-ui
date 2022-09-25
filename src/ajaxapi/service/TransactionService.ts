import {
	CategorizeTransactionsRequest,
	DATE_FORMAT, DeleteTransactionsRequest,
	NeedsAttentionResponse,
	SearchTransactionsRequest,
	SearchTransactionsResponse,
	TransactionAndCategory,
	TransactionToUpdate,
	UpdateTransactionsRequest
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

const handleCategoryIds = (
	isCategorized: boolean | undefined,
	categoryIds: ReadonlyArray<string> | undefined
): string | undefined => {
	if (isCategorized === false) {
		return undefined;
	}
	return handleOptionalValue(categoryIds, (ids) => ids.join(','));
};

export const requestToQuery = (request: SearchTransactionsRequest): string =>
	qs.stringify({
		...request,
		startDate: handleOptionalValue(request.startDate, formatSearchDate),
		endDate: handleOptionalValue(request.endDate, formatSearchDate),
		categoryIds: handleCategoryIds(
			request.isCategorized,
			request.categoryIds
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
	expenseTrackerApi.put<CategorizeTransactionsRequest, unknown>({
		uri: '/transactions/categorize',
		errorCustomizer: 'Error categorizing transactions',
		body: {
			transactionsAndCategories
		}
	});

export const updateTransactions = (
	transactions: ReadonlyArray<TransactionToUpdate>
): Promise<unknown> =>
	expenseTrackerApi.put<UpdateTransactionsRequest, unknown>({
		uri: '/transactions',
		errorCustomizer: 'Error updating transactions',
		body: {
			transactions
		}
	});

export const deleteTransactions = (
	idsToDelete: ReadonlyArray<string>
): Promise<unknown> =>
	expenseTrackerApi.put<DeleteTransactionsRequest, unknown>({
		uri: '/transactions',
		errorCustomizer: 'Error deleting transactions',
		body: {
			ids: idsToDelete
		}
	});

export const getNeedsAttention = (): Promise<NeedsAttentionResponse> =>
	expenseTrackerApi
		.get<NeedsAttentionResponse>({
			uri: '/transactions/needs-attention',
			errorCustomizer:
				'Error getting stats on transactions that need attention'
		})
		.then(getData);
