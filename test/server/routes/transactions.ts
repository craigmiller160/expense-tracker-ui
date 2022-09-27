import { Database } from '../Database';
import { Server } from 'miragejs/server';
import { Response } from 'miragejs';
import {
	CategorizeTransactionsRequest,
	DATE_FORMAT,
	DeleteTransactionsRequest,
	NeedsAttentionResponse,
	TransactionResponse,
	UpdateTransactionsRequest
} from '../../../src/types/transactions';
import * as Time from '@craigmiller160/ts-functions/es/Time';
import * as RArray from 'fp-ts/es6/ReadonlyArray';
import { pipe } from 'fp-ts/es6/function';
import { match } from 'ts-pattern';
import { SortDirection } from '../../../src/types/misc';
import { Ordering } from 'fp-ts/es6/Ordering';
import { Ord } from 'fp-ts/es6/Ord';
import * as Monoid from 'fp-ts/es6/Monoid';
import { MonoidT } from '@craigmiller160/ts-functions/es/types';

const parseDate = Time.parse(DATE_FORMAT);

const compareDates = (
	dateString1: string,
	dateString2: string,
	sortDirection: SortDirection
): Ordering => {
	const date1 = parseDate(dateString1);
	const date2 = parseDate(dateString2);
	return match(sortDirection)
		.with(SortDirection.ASC, () => Time.compare(date1)(date2))
		.otherwise(() => Time.compare(date2)(date1));
};

const createSortTransactionOrd = (
	sortDirection: SortDirection
): Ord<TransactionResponse> => ({
	compare: (txn1, txn2) =>
		compareDates(txn1.expenseDate, txn2.expenseDate, sortDirection),
	equals: (txn1, txn2) => txn1.expenseDate === txn2.expenseDate
});

const paginateTransactions =
	(pageNumber: number, pageSize: number) =>
	(
		transactions: ReadonlyArray<TransactionResponse>
	): ReadonlyArray<TransactionResponse> =>
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
		const txnDate = parseDate(transaction.expenseDate);
		const startDate = parseDate(startDateString);
		return Time.compare(startDate)(txnDate) <= 0;
	};
const createEndDateFilter =
	(endDateString?: string) =>
	(transaction: TransactionResponse): boolean => {
		if (!endDateString) {
			return true;
		}
		const txnDate = parseDate(transaction.expenseDate);
		const endDate = parseDate(endDateString);
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

const transactionToNeedsAttention = (
	transaction: TransactionResponse
): NeedsAttentionResponse => ({
	unconfirmed: {
		count: transaction.confirmed === false ? 1 : 0,
		oldest: transaction.confirmed === false ? transaction.expenseDate : null
	},
	uncategorized: {
		count: transaction.categoryId ? 0 : 1,
		oldest: transaction.categoryId ? null : transaction.expenseDate
	},
	duplicate: {
		count: transaction.duplicate ? 1 : 0,
		oldest: transaction.duplicate ? transaction.expenseDate : null
	}
});

const getOldestDate = (
	dateString1: string | null,
	dateString2: string | null
): string | null => {
	if (dateString1 === null) {
		return dateString2;
	}

	if (dateString2 === null) {
		return null;
	}

	const date1 = Time.parse(DATE_FORMAT)(dateString1);
	const date2 = Time.parse(DATE_FORMAT)(dateString2);
	const comparison = Time.compare(date1)(date2);
	if (comparison >= 0) {
		return dateString1;
	}
	return dateString2;
};

const needsAttentionMonoid: MonoidT<NeedsAttentionResponse> = {
	empty: {
		unconfirmed: {
			count: 0,
			oldest: null
		},
		uncategorized: {
			count: 0,
			oldest: null
		},
		duplicate: {
			count: 0,
			oldest: null
		}
	},
	concat: (res1, res2) => ({
		unconfirmed: {
			count: res1.unconfirmed.count + res2.unconfirmed.count,
			oldest: getOldestDate(
				res1.unconfirmed.oldest,
				res2.unconfirmed.oldest
			)
		},
		uncategorized: {
			count: res1.uncategorized.count + res2.uncategorized.count,
			oldest: getOldestDate(
				res1.uncategorized.oldest,
				res2.uncategorized.oldest
			)
		},
		duplicate: {
			count: res1.duplicate.count + res2.duplicate.count,
			oldest: getOldestDate(res1.duplicate.oldest, res2.duplicate.oldest)
		}
	})
};

export const createTransactionsRoutes = (
	database: Database,
	server: Server
) => {
	server.get('/transactions', (schema, request) => {
		const sortDirection = request.queryParams
			?.sortDirection as SortDirection;
		const pageNumber = parseInt(`${request.queryParams?.pageNumber}`);
		const pageSize = parseInt(`${request.queryParams?.pageSize}`);
		const transactions = pipe(
			Object.values(database.data.transactions),
			RArray.sort(createSortTransactionOrd(sortDirection)),
			RArray.filter(
				createStartDateFilter(request.queryParams?.startDate)
			),
			RArray.filter(createEndDateFilter(request.queryParams?.endDate)),
			RArray.filter(
				createCategoryIdFilter(request.queryParams?.categoryIds)
			),
			RArray.filter(
				createIsCategorizedFilter(request.queryParams?.isCategorized)
			),
			RArray.filter(
				createIsConfirmedFilter(request.queryParams?.isConfirmed)
			),
			RArray.filter(
				createIsDuplicateFilter(request.queryParams?.isDuplicate)
			)
		);
		const paginatedTransactions = paginateTransactions(
			pageNumber,
			pageSize
		)(transactions);
		return {
			transactions: paginatedTransactions,
			pageNumber,
			totalItems: transactions.length
		};
	});

	server.put('/transactions/categorize', (schema, request) => {
		const body = JSON.parse(
			request.requestBody
		) as CategorizeTransactionsRequest;
		const newTransactions = body.transactionsAndCategories.map(
			(txnAndCat) => {
				const txn = database.data.transactions[txnAndCat.transactionId];
				const cat = txnAndCat.categoryId
					? database.data.categories[txnAndCat.categoryId]
					: undefined;
				return {
					...txn,
					categoryId: txnAndCat.categoryId ?? undefined,
					categoryName: cat?.name,
					confirmed: txn.confirmed || !!txnAndCat.categoryId
				};
			}
		);
		database.updateData((draft) => {
			newTransactions.forEach((txn) => {
				draft.transactions[txn.id] = txn;
			});
		});

		return new Response(204);
	});

	server.get('/transactions/needs-attention', () => {
		return pipe(
			Object.values(database.data.transactions),
			RArray.map(transactionToNeedsAttention),
			Monoid.concatAll(needsAttentionMonoid)
		);
	});

	server.put('/transactions', (schema, request) => {
		const body = JSON.parse(
			request.requestBody
		) as UpdateTransactionsRequest;
		database.updateData((draft) => {
			body.transactions.forEach(
				({ transactionId, categoryId, confirmed }) => {
					draft.transactions[transactionId] = {
						...draft.transactions[transactionId],
						categoryId: categoryId ?? undefined,
						categoryName: categoryId
							? draft.categories[categoryId].name
							: undefined,
						confirmed
					};
				}
			);
		});

		return new Response(204);
	});

	server.delete('/transactions', (schema, request) => {
		const body = JSON.parse(
			request.requestBody
		) as DeleteTransactionsRequest;
		database.updateData((draft) => {
			body.ids.forEach((id) => {
				delete draft.transactions[id];
			});
		});
		return new Response(204);
	});
};
