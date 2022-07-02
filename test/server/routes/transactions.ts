import { Database } from '../Database';
import { Server } from 'miragejs/server';
import { Response } from 'miragejs';
import {
	CategorizeTransactionsRequest,
	DATE_FORMAT,
	TransactionResponse
} from '../../../src/types/transactions';
import * as Time from '@craigmiller160/ts-functions/es/Time';
import * as RArray from 'fp-ts/es6/ReadonlyArray';
import { pipe } from 'fp-ts/es6/function';
import { match } from 'ts-pattern';
import { SortDirection } from '../../../src/types/misc';
import { Ordering } from 'fp-ts/es6/Ordering';
import { Ord } from 'fp-ts/es6/Ord';

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

const sortTransactions =
	(sortDirection: SortDirection) =>
	(
		transactions: ReadonlyArray<TransactionResponse>
	): ReadonlyArray<TransactionResponse> =>
		pipe(
			transactions,
			RArray.sort(createSortTransactionOrd(sortDirection))
		);

const paginateTransactions =
	(pageNumber: number, pageSize: number) =>
	(
		transactions: ReadonlyArray<TransactionResponse>
	): ReadonlyArray<TransactionResponse> =>
		transactions.slice(
			pageNumber * pageSize,
			pageNumber * pageSize + pageSize
		);

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
			sortTransactions(sortDirection),
			paginateTransactions(pageNumber, pageSize)
		);
		return {
			transactions,
			pageNumber,
			totalItems: Object.values(database.data.transactions).length
		};
	});

	server.put('/transactions/categorize', (schema, request) => {
		const body = JSON.parse(
			request.requestBody
		) as CategorizeTransactionsRequest;
		const newTransactions = body.transactionsAndCategories.map(
			(txnAndCat) => {
				const txn = database.data.transactions[txnAndCat.transactionId];
				const cat = database.data.categories[txnAndCat.categoryId];
				return {
					...txn,
					categoryId: txnAndCat.categoryId,
					categoryName: cat.name
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
};
