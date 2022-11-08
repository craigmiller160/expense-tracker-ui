import { Database } from '../Database';
import { Server } from 'miragejs/server';
import { Response } from 'miragejs';
import {
	CategorizeTransactionsRequest,
	CreateTransactionRequest,
	DeleteTransactionsRequest,
	NeedsAttentionResponse,
	TransactionDuplicateResponse,
	TransactionResponse,
	UpdateTransactionDetailsRequest,
	UpdateTransactionsRequest,
	CategoryResponse,
	TransactionDetailsResponse
} from '../../../src/types/generated/expense-tracker';
import * as RArray from 'fp-ts/es6/ReadonlyArray';
import { pipe } from 'fp-ts/es6/function';
import { match } from 'ts-pattern';
import { SortDirection } from '../../../src/types/misc';
import { Ord } from 'fp-ts/es6/Ord';
import * as Monoid from 'fp-ts/es6/Monoid';
import { MonoidT } from '@craigmiller160/ts-functions/es/types';
import { nanoid } from 'nanoid';
import {
	compareServerDates,
	parseServerDate
} from '../../../src/utils/dateTimeUtils';
import * as Time from '@craigmiller160/ts-functions/es/Time';

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

const transactionToNeedsAttention = (
	transaction: TransactionResponse
): NeedsAttentionResponse => ({
	unconfirmed: {
		count: transaction.confirmed === false ? 1 : 0,
		oldest:
			transaction.confirmed === false
				? transaction.expenseDate
				: undefined
	},
	uncategorized: {
		count: transaction.categoryId ? 0 : 1,
		oldest: transaction.categoryId ? undefined : transaction.expenseDate
	},
	duplicate: {
		count: transaction.duplicate ? 1 : 0,
		oldest: transaction.duplicate ? transaction.expenseDate : undefined
	},
	possibleRefund: {
		count: transaction.amount > 0 ? 1 : 0,
		oldest: transaction.amount > 0 ? transaction.expenseDate : undefined
	}
});

const getOldestDate = (
	dateString1: string | undefined,
	dateString2: string | undefined
): string | undefined => {
	if (dateString1 === undefined) {
		return dateString2;
	}

	if (dateString2 === undefined) {
		return undefined;
	}

	const date1 = parseServerDate(dateString1);
	const date2 = parseServerDate(dateString2);
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
			oldest: undefined
		},
		uncategorized: {
			count: 0,
			oldest: undefined
		},
		duplicate: {
			count: 0,
			oldest: undefined
		},
		possibleRefund: {
			count: 0,
			oldest: undefined
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
		},
		possibleRefund: {
			count: res1.possibleRefund.count + res2.possibleRefund.count,
			oldest: getOldestDate(
				res1.possibleRefund.oldest,
				res2.possibleRefund.oldest
			)
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
			),
			RArray.filter(
				createIsPossibleRefundFilter(
					request.queryParams?.isPossibleRefund
				)
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

	server.put('/transactions/:id/details', (schema, request) => {
		const id = request.params.id as string;
		const requestBody = JSON.parse(
			request.requestBody
		) as UpdateTransactionDetailsRequest;
		database.updateData((draft) => {
			const existing = draft.transactions[id];
			if (existing) {
				draft.transactions[id] = {
					...existing,
					confirmed: requestBody.confirmed,
					expenseDate: requestBody.expenseDate,
					description: requestBody.description,
					amount: requestBody.amount,
					categoryId: requestBody.categoryId
				};

				if (requestBody.categoryId) {
					const category = draft.categories[requestBody.categoryId];
					draft.transactions[id].categoryName = category.name;
				}
			}
		});
		return new Response(204);
	});

	server.post('/transactions', (schema, request) => {
		const requestBody = JSON.parse(
			request.requestBody
		) as CreateTransactionRequest;

		const id = nanoid();
		const category: CategoryResponse | undefined =
			database.data.categories[requestBody.categoryId ?? ''];
		database.updateData((draft) => {
			draft.transactions[id] = {
				id,
				categoryId: category?.id,
				categoryName: category?.name,
				description: requestBody.description,
				amount: requestBody.amount,
				confirmed: true,
				duplicate: false,
				expenseDate: requestBody.expenseDate,
				created: '',
				updated: ''
			};
		});
		return database.data.transactions[id];
	});

	server.get('/transactions/:transactionId/details', (schema, request) => {
		const transactionId = request.params.transactionId as string;
		return Object.values(database.data.transactions).filter(
			(txn) => txn.id === transactionId
		)[0];
	});

	server.get('/transactions/:transactionId/duplicates', (schema, request) => {
		const transactionId = request.params.transactionId as string;
		const pageNumber = parseInt(`${request.queryParams?.pageNumber}`);
		const pageSize = parseInt(`${request.queryParams?.pageSize}`);
		const matchingTxn = database.data.transactions[transactionId];
		const duplicates = Object.values(database.data.transactions)
			.filter((txn) => txn.duplicate)
			.filter(
				(txn) =>
					matchingTxn.expenseDate === txn.expenseDate &&
					matchingTxn.amount === txn.amount &&
					matchingTxn.description === txn.description &&
					matchingTxn.id !== txn.id
			);
		const paginatedDuplicates = paginateTransactions(
			pageNumber,
			pageSize
		)(duplicates);
		return {
			transactions: paginatedDuplicates.map(
				(txn): TransactionDuplicateResponse => ({
					id: txn.id,
					created: txn.created,
					updated: txn.updated,
					categoryName: txn.categoryName
				})
			),
			pageNumber,
			totalItems: duplicates.length
		};
	});
};
