import { SortDirection } from '../../../src/types/misc';
import type { Ord } from 'fp-ts/Ord';
import type {
	TransactionDetailsResponse,
	TransactionResponse,
	TransactionsPageResponse
} from '../../../src/types/generated/expense-tracker';
import {
	compareServerDates,
	parseServerDate
} from '../../../src/utils/dateTimeUtils';
import { Time } from '@craigmiller160/ts-functions';
import { match } from 'ts-pattern';
import type { DefaultBodyType, HttpHandler, PathParams } from 'msw';
import { http, HttpResponse } from 'msw';
import { pipe } from 'fp-ts/function';
import * as RArray from 'fp-ts/ReadonlyArray';
import { database } from '../Database';

const createSortTransactionOrd = (
	sortDirection: SortDirection
): Ord<TransactionResponse> => ({
	compare: (txn1, txn2) =>
		compareServerDates(txn1.expenseDate, txn2.expenseDate, sortDirection),
	equals: (txn1, txn2) => txn1.expenseDate === txn2.expenseDate
});

const paginateTransactions =
	(pageNumber: number, pageSize: number) =>
	(
		transactions: ReadonlyArray<TransactionDetailsResponse>
	): ReadonlyArray<TransactionDetailsResponse> =>
		transactions.slice(
			pageNumber * pageSize,
			pageNumber * pageSize + pageSize
		);

const createStartDateFilter =
	(startDateString: string | null) =>
	(transaction: TransactionResponse): boolean => {
		if (!startDateString) {
			return true;
		}
		const txnDate = parseServerDate(transaction.expenseDate);
		const startDate = parseServerDate(startDateString);
		return Time.compare(startDate)(txnDate) <= 0;
	};
const createEndDateFilter =
	(endDateString: string | null) =>
	(transaction: TransactionResponse): boolean => {
		if (!endDateString) {
			return true;
		}
		const txnDate = parseServerDate(transaction.expenseDate);
		const endDate = parseServerDate(endDateString);
		return Time.compare(endDate)(txnDate) >= 0;
	};
const createCategoryIdFilter = (categoryIdString: string | null) => {
	if (!categoryIdString) {
		return () => true;
	}
	const categoryIds = categoryIdString.split(',').map((s) => s.trim());
	return (transaction: TransactionResponse): boolean =>
		categoryIds.includes(transaction.categoryId ?? '');
};
const createIsCategorizedFilter =
	(isCategorized: string | null) =>
	(transaction: TransactionResponse): boolean =>
		match(isCategorized)
			.with(null, () => true)
			.with('true', () => transaction.categoryId !== undefined)
			.otherwise(() => transaction.categoryId === undefined);
const createIsConfirmedFilter =
	(isConfirmed: string | null) =>
	(transaction: TransactionResponse): boolean =>
		match(isConfirmed)
			.with(null, () => true)
			.with('true', () => transaction.confirmed === true)
			.otherwise(() => transaction.confirmed === false);
const createIsDuplicateFilter =
	(isDuplicate: string | null) =>
	(transaction: TransactionResponse): boolean =>
		match(isDuplicate)
			.with(null, () => true)
			.with('true', () => transaction.duplicate === true)
			.otherwise(() => transaction.duplicate === false);

const createIsPossibleRefundFilter =
	(isPossibleRefund: string | null) =>
	(transaction: TransactionResponse): boolean =>
		match(isPossibleRefund)
			.with(null, () => true)
			.with('true', () => transaction.amount > 0)
			.otherwise(() => transaction.amount <= 0);

const getAllTransactionsHandler: HttpHandler = http.get<
	PathParams,
	DefaultBodyType,
	TransactionsPageResponse
>('http://localhost/expense-tracker/api/transactions', ({ request }) => {
	const url = new URL(request.url);
	const sortDirection = url.searchParams.get(
		'sortDirection'
	) as SortDirection;
	const pageNumber = parseInt(url.searchParams.get('pageNumber') ?? '0');
	const pageSize = parseInt(url.searchParams.get('pageSize') ?? '0');
	const transactions = pipe(
		Object.values(database.data.transactions),
		RArray.sort(createSortTransactionOrd(sortDirection)),
		RArray.filter(createStartDateFilter(url.searchParams.get('startDate'))),
		RArray.filter(createEndDateFilter(url.searchParams.get('endDate'))),
		RArray.filter(
			createCategoryIdFilter(url.searchParams.get('categoryIds'))
		),
		RArray.filter(
			createIsCategorizedFilter(url.searchParams.get('isCategorized'))
		),
		RArray.filter(
			createIsConfirmedFilter(url.searchParams.get('isConfirmed'))
		),
		RArray.filter(
			createIsDuplicateFilter(url.searchParams.get('isDuplicate'))
		),
		RArray.filter(
			createIsPossibleRefundFilter(
				url.searchParams.get('isPossibleRefund')
			)
		)
	);
	const paginatedTransactions = paginateTransactions(
		pageNumber,
		pageSize
	)(transactions);
	return HttpResponse.json({
		transactions: paginatedTransactions,
		pageNumber,
		totalItems: transactions.length
	});
});
