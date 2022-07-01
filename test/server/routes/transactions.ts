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

const parseDate = Time.parse(DATE_FORMAT);

const compareDates = (
	dateString1: string,
	dateString2: string,
	sortDirection: SortDirection
): Ordering => {
	const date1 = parseDate(dateString1);
	const date2 = parseDate(dateString2);
	return match(sortDirection)
		.with(SortDirection.ASC, () => Time.compare(date1)(date2) as Ordering)
		.otherwise(() => Time.compare(date2)(date1) as Ordering);
};

const sortTransactions = (
	transactions: ReadonlyArray<TransactionResponse>,
	sortDirection: SortDirection
): ReadonlyArray<TransactionResponse> =>
	pipe(
		transactions,
		RArray.sort<TransactionResponse>((txn1, txn2) =>
			compareDates(txn1.expenseDate, txn2.expenseDate, sortDirection)
		)
	);

export const createTransactionsRoutes = (
	database: Database,
	server: Server
) => {
	server.get('/transactions', (schema, request) => {
		database.data.transactions;
	});

	server.put('/transactions/categorize', () => new Response(204));
};
