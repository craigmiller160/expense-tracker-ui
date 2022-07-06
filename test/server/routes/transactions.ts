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
import { flow, pipe } from 'fp-ts/es6/function';
import { match } from 'ts-pattern';
import { SortDirection } from '../../../src/types/misc';
import { Ordering } from 'fp-ts/es6/Ordering';
import { Ord } from 'fp-ts/es6/Ord';
import { TestTransactionDescription } from '../createTransaction';
import { TryT } from '@craigmiller160/ts-functions/es/types';
import * as Try from '@craigmiller160/ts-functions/es/Try';
import * as Either from 'fp-ts/es6/Either';
import * as Json from '@craigmiller160/ts-functions/es/Json';
import { screen } from '@testing-library/react';

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
};

type ValidateDescription = (
	index: number,
	description: TestTransactionDescription
) => void;

const validateTransactionDescription =
	(validateDescription: ValidateDescription) =>
	(index: number, description: TestTransactionDescription): TryT<unknown> =>
		pipe(
			Try.tryCatch(() => validateDescription(index, description)),
			Either.mapLeft(
				(ex) =>
					new Error(
						`Error validating description ${JSON.stringify(
							description
						)}: ${ex.message}`,
						{
							cause: ex
						}
					)
			)
		);

const validateNullableTextAndParse = (
	descriptionElement: HTMLElement
): TryT<TestTransactionDescription> => {
	if (descriptionElement.textContent === null) {
		return Either.left(
			new Error('Description text content cannot be null')
		);
	}
	return Json.parseE<TestTransactionDescription>(
		descriptionElement.textContent
	);
};

export const validateTransactionsInTable = (
	count: number,
	validateDescription: ValidateDescription
) => {
	const descriptions = screen.getAllByTestId('transaction-description');
	expect(descriptions).toHaveLength(count);
	const result = pipe(
		descriptions,
		RArray.map(validateNullableTextAndParse),
		Either.sequenceArray,
		Either.chain(
			flow(
				RArray.mapWithIndex(
					validateTransactionDescription(validateDescription)
				),
				Either.sequenceArray
			)
		)
	);
	if (Either.isLeft(result)) {
		throw result.left;
	}
};
