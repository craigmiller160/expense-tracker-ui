import { Database } from '../Database';
import { Server } from 'miragejs/server';
import { Response } from 'miragejs';
import {
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
		transactions.slice(pageNumber, pageNumber + pageSize);

export const createTransactionsRoutes = (
	database: Database,
	server: Server
) => {
	server.get('/transactions', (schema, request) => {
		const sortDirection = request.queryParams
			?.sortDirection as SortDirection;
		const pageNumber = request.queryParams?.pageNumber as number;
		const pageSize = request.queryParams?.pageSize as number;
		return pipe(
			Object.values(database.data.transactions),
			sortTransactions(sortDirection),
			paginateTransactions(pageNumber, pageSize)
		);
	});

	server.put('/transactions/categorize', () => new Response(204));
};
