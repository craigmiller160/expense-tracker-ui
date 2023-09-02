import { Database } from '../Database';
import { Server } from 'miragejs/server';
import { Response } from 'miragejs';
import {
	CategorizeTransactionsRequest,
	CategoryResponse,
	CreateTransactionRequest,
	DeleteTransactionsRequest,
	TransactionDetailsResponse,
	TransactionDuplicateResponse,
	TransactionResponse,
	UpdateTransactionDetailsRequest,
	UpdateTransactionsRequest
} from '../../../src/types/generated/expense-tracker';
import * as RArray from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { match } from 'ts-pattern';
import { SortDirection } from '../../../src/types/misc';
import { Ord } from 'fp-ts/Ord';
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

	server.get('/transactions/rules/lastApplied/:transactionId', () => {
		return new Response(204);
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
					categoryName: txn.categoryName,
					confirmed: false
				})
			),
			pageNumber,
			totalItems: duplicates.length
		};
	});
};
