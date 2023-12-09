import { SortDirection } from '../../../src/types/misc';
import type { Ord } from 'fp-ts/Ord';
import type {
	CategorizeTransactionsRequest,
	CreateTransactionRequest,
	DeleteTransactionsRequest,
	TransactionDetailsResponse,
	TransactionDuplicatePageResponse,
	TransactionDuplicateResponse,
	TransactionResponse,
	TransactionsPageResponse,
	UpdateTransactionsRequest,
	CategoryResponse,
	UpdateTransactionDetailsRequest
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
import { v4 as uuidv4 } from 'uuid';

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

const categorizeTransactionHandler: HttpHandler = http.put<
	PathParams,
	CategorizeTransactionsRequest
>(
	'http://localhost/expense-tracker/api/transactions/categorize',
	async ({ request }) => {
		const body = await request.json();
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
		return HttpResponse.json('', {
			status: 204
		});
	}
);

const updateTransactionsHandler: HttpHandler = http.put<
	PathParams,
	UpdateTransactionsRequest
>('http://localhost/expense-tracker/api/transactions', async ({ request }) => {
	const body = await request.json();
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
	return HttpResponse.json('', {
		status: 204
	});
});

const deleteTransactionsHandler: HttpHandler = http.delete<
	PathParams,
	DeleteTransactionsRequest
>('http://localhost/expense-tracker/api/transactions', async ({ request }) => {
	const body = await request.json();
	database.updateData((draft) => {
		body.ids.forEach((id) => {
			delete draft.transactions[id];
		});
	});
	return HttpResponse.json('', {
		status: 204
	});
});

const updateTransactionDetailsHandler: HttpHandler = http.put<
	{ id: string },
	UpdateTransactionDetailsRequest
>(
	'http://localhost/expense-tracker/api/transactions/:id/details',
	async ({ params, request }) => {
		const id = params.id;
		const requestBody = await request.json();
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
		return HttpResponse.json('', {
			status: 204
		});
	}
);

const createTransactionHandler: HttpHandler = http.post<
	PathParams,
	CreateTransactionRequest,
	TransactionDetailsResponse
>('http://localhost/expense-tracker/api/transactions', async ({ request }) => {
	const requestBody = await request.json();
	const id = uuidv4();
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
	return HttpResponse.json(database.data.transactions[id]);
});

const getTransactionDetailsHandler: HttpHandler = http.get<
	{ transactionId: string },
	DefaultBodyType,
	TransactionDetailsResponse
>('/transactions/:transactionId/details', ({ params }) => {
	const transactionId = params.transactionId;
	const result = Object.values(database.data.transactions).filter(
		(txn) => txn.id === transactionId
	)[0];
	return HttpResponse.json(result);
});

const getLastRuleAppliedHandler: HttpHandler = http.get<{
	transactionId: string;
}>(
	'http://localhost/expense-tracker/api/transactions/rules/lastApplied/:transactionId',
	() =>
		HttpResponse.json('', {
			status: 204
		})
);

const getPossibleDuplicatesHandler: HttpHandler = http.get<
	{ transactionId: string },
	DefaultBodyType,
	TransactionDuplicatePageResponse
>(
	'http://localhost/expense-tracker/api/transactions/:transactionId/duplicates',
	({ params, request }) => {
		const transactionId = params.transactionId;
		const url = new URL(request.url);
		const pageNumber = parseInt(url.searchParams.get('pageNumber') ?? '0');
		const pageSize = parseInt(url.searchParams.get('pageSize') ?? '0');
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
		const response: TransactionDuplicatePageResponse = {
			transactions: paginatedDuplicates.map(
				(txn): TransactionDuplicateResponse => ({
					id: txn.id,
					created: txn.created,
					updated: txn.updated,
					categoryName: txn.categoryName,
					confirmed: false
				})
			),
			pageNumber,
			totalItems: duplicates.length
		};
		return HttpResponse.json(response);
	}
);

export const transactionHandlers: ReadonlyArray<HttpHandler> = [
	getAllTransactionsHandler,
	categorizeTransactionHandler,
	updateTransactionDetailsHandler,
	updateTransactionsHandler,
	deleteTransactionsHandler,
	createTransactionHandler,
	getLastRuleAppliedHandler,
	getTransactionDetailsHandler,
	getPossibleDuplicatesHandler
];
