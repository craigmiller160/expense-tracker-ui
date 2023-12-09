import { SortDirection } from '../../../src/types/misc';
import type { Ord } from 'fp-ts/Ord';
import type {
	TransactionDetailsResponse,
	TransactionResponse
} from '../../../src/types/generated/expense-tracker';
import {
	compareServerDates,
	parseServerDate
} from '../../../src/utils/dateTimeUtils';
import { Time } from '@craigmiller160/ts-functions';
import { match } from 'ts-pattern';

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
	(startDateString?: string) =>
	(transaction: TransactionResponse): boolean => {
		if (!startDateString) {
			return true;
		}
		const txnDate = parseServerDate(transaction.expenseDate);
		const startDate = parseServerDate(startDateString);
		return Time.compare(startDate)(txnDate) <= 0;
	};
const createEndDateFilter =
	(endDateString?: string) =>
	(transaction: TransactionResponse): boolean => {
		if (!endDateString) {
			return true;
		}
		const txnDate = parseServerDate(transaction.expenseDate);
		const endDate = parseServerDate(endDateString);
		return Time.compare(endDate)(txnDate) >= 0;
	};
const createCategoryIdFilter = (categoryIdString?: string) => {
	if (!categoryIdString) {
		return () => true;
	}
	const categoryIds = categoryIdString.split(',').map((s) => s.trim());
	return (transaction: TransactionResponse): boolean =>
		categoryIds.includes(transaction.categoryId ?? '');
};
const createIsCategorizedFilter =
	(isCategorized?: string) =>
	(transaction: TransactionResponse): boolean =>
		match(isCategorized)
			.with(undefined, () => true)
			.with('true', () => transaction.categoryId !== undefined)
			.otherwise(() => transaction.categoryId === undefined);
const createIsConfirmedFilter =
	(isConfirmed?: string) =>
	(transaction: TransactionResponse): boolean =>
		match(isConfirmed)
			.with(undefined, () => true)
			.with('true', () => transaction.confirmed === true)
			.otherwise(() => transaction.confirmed === false);
const createIsDuplicateFilter =
	(isDuplicate?: string) =>
	(transaction: TransactionResponse): boolean =>
		match(isDuplicate)
			.with(undefined, () => true)
			.with('true', () => transaction.duplicate === true)
			.otherwise(() => transaction.duplicate === false);

const createIsPossibleRefundFilter =
	(isPossibleRefund?: string) =>
	(transaction: TransactionResponse): boolean =>
		match(isPossibleRefund)
			.with(undefined, () => true)
			.with('true', () => transaction.amount > 0)
			.otherwise(() => transaction.amount <= 0);
