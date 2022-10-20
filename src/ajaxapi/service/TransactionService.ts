import {
	CreateTransactionRequest,
	UpdateTransactionDetailsRequest,
	TransactionDuplicatePageResponse,
	EnhancedSearchTransactionsRequest
} from '../../types/transactions';
import {
	DeleteTransactionsRequest,
	TransactionToUpdate,
	UpdateTransactionsRequest,
	NeedsAttentionResponse,
	CategorizeTransactionsRequest,
	TransactionResponse,
	TransactionsPageResponse,
	TransactionAndCategory
} from '../../types/generated/expense-tracker';
import qs from 'qs';
import { pipe } from 'fp-ts/es6/function';
import * as Option from 'fp-ts/es6/Option';
import { expenseTrackerApi, getData } from './AjaxApi';
import { formatServerDate } from '../../utils/dateTimeUtils';

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

export const requestToQuery = (
	request: EnhancedSearchTransactionsRequest
): string =>
	qs.stringify({
		...request,
		startDate: handleOptionalValue(request.startDate, formatServerDate),
		endDate: handleOptionalValue(request.endDate, formatServerDate),
		categoryIds: handleCategoryIds(
			request.isCategorized,
			request.categoryIds
		)
	});

export const searchForTransactions = (
	request: EnhancedSearchTransactionsRequest
): Promise<TransactionsPageResponse> => {
	const query = requestToQuery(request);
	return expenseTrackerApi
		.get<TransactionsPageResponse>({
			uri: `/transactions?${query}`,
			errorCustomizer: 'Error searching for transactions'
		})
		.then(getData);
};

export const categorizeTransactions = (
	transactionsAndCategories: ReadonlyArray<TransactionAndCategory>
): Promise<unknown> =>
	expenseTrackerApi.put<unknown, CategorizeTransactionsRequest>({
		uri: '/transactions/categorize',
		errorCustomizer: 'Error categorizing transactions',
		body: {
			transactionsAndCategories
		}
	});

export const updateTransactions = (
	transactions: ReadonlyArray<TransactionToUpdate>
): Promise<unknown> =>
	expenseTrackerApi.put<unknown, UpdateTransactionsRequest>({
		uri: '/transactions',
		errorCustomizer: 'Error updating transactions',
		body: {
			transactions
		}
	});

export const deleteTransactions = (
	idsToDelete: ReadonlyArray<string>
): Promise<void> =>
	expenseTrackerApi
		.delete<void, DeleteTransactionsRequest>({
			uri: '/transactions',
			errorCustomizer: 'Error deleting transactions',
			body: {
				ids: idsToDelete
			}
		})
		.then(getData);

export const getNeedsAttention = (): Promise<NeedsAttentionResponse> =>
	expenseTrackerApi
		.get<NeedsAttentionResponse>({
			uri: '/transactions/needs-attention',
			errorCustomizer:
				'Error getting stats on transactions that need attention'
		})
		.then(getData);

export const updateTransactionDetails = (
	request: UpdateTransactionDetailsRequest
): Promise<void> =>
	expenseTrackerApi
		.put<void, UpdateTransactionDetailsRequest>({
			uri: `/transactions/${request.transactionId}/details`,
			errorCustomizer: 'Error updating transaction details',
			body: request
		})
		.then(getData);

export const createTransaction = (
	request: CreateTransactionRequest
): Promise<TransactionResponse> =>
	expenseTrackerApi
		.post<TransactionResponse, CreateTransactionRequest>({
			uri: '/transactions',
			errorCustomizer: 'Error creating transaction',
			body: request
		})
		.then(getData);

export const getPossibleDuplicates = (
	transactionId: string,
	pageNumber: number,
	pageSize: number
): Promise<TransactionDuplicatePageResponse> =>
	expenseTrackerApi
		.get<TransactionDuplicatePageResponse>({
			uri: `/transactions/${transactionId}/duplicates?pageNumber=${pageNumber}&pageSize=${pageSize}`,
			errorCustomizer: 'Error finding possible duplicates'
		})
		.then(getData);
