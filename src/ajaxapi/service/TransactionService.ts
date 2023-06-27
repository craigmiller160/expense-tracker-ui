import { EnhancedSearchTransactionsRequest } from '../../types/transactions';
import {
	CategorizeTransactionsRequest,
	CreateTransactionRequest,
	DeleteTransactionsRequest,
	DeleteTransactionsResponse,
	TransactionAndCategory,
	TransactionDetailsResponse,
	TransactionDuplicatePageResponse,
	TransactionResponse,
	TransactionsPageResponse,
	TransactionToUpdate,
	UpdateTransactionDetailsRequest,
	UpdateTransactionsRequest
} from '../../types/generated/expense-tracker';
import qs from 'qs';
import { pipe } from 'fp-ts/es6/function';
import * as Option from 'fp-ts/es6/Option';
import { expenseTrackerApi, getData } from './AjaxApi';
import { formatServerDate } from '../../utils/dateTimeUtils';
import { YesNoFilter } from '../../types/misc';

const handleOptionalValue = <T>(
	value: T | undefined | null,
	formatter: (v: T) => string
): string | undefined =>
	pipe(
		Option.fromNullable(value),
		Option.map(formatter),
		Option.getOrElse((): string | undefined => undefined)
	);

const handleCategoryIds = (
	categorized: YesNoFilter,
	categoryIds: ReadonlyArray<string> | undefined
): string | undefined => {
	if ('NO' === categorized) {
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
			request.categorized,
			request.categoryIds
		),
		description: request.description ? request.description : undefined
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

export const getTransactionDetails = (
	transactionId: string
): Promise<TransactionDetailsResponse> =>
	expenseTrackerApi
		.get<TransactionDetailsResponse>({
			uri: `/transactions/${transactionId}/details`,
			errorCustomizer: 'Error getting transaction details'
		})
		.then(getData);

export const markNotDuplicate = (transactionId: string): Promise<void> =>
	expenseTrackerApi
		.put<void, void>({
			uri: `/transactions/${transactionId}/notDuplicate`,
			errorCustomizer: 'Error marking transaction as not duplicate'
		})
		.then(getData);

export const deleteAllUnconfirmed = (): Promise<DeleteTransactionsResponse> =>
	expenseTrackerApi
		.delete<DeleteTransactionsResponse>({
			uri: '/transactions/unconfirmed',
			errorCustomizer: 'Error deleting all unconfirmed transactions'
		})
		.then(getData);
