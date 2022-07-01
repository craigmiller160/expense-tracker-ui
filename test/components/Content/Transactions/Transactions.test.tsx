import { ApiServer, newApiServer } from '../../../server';
import { renderApp } from '../../../testutils/renderApp';
import { screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as RNonEmptyArray from 'fp-ts/es6/ReadonlyNonEmptyArray';
import { pipe } from 'fp-ts/es6/function';
import * as Try from '@craigmiller160/ts-functions/es/Try';
import { TryT, MonoidT } from '@craigmiller160/ts-functions/es/types';
import * as Either from 'fp-ts/es6/Either';
import { match } from 'ts-pattern';
import * as Monoid from 'fp-ts/es6/Monoid';

const validationMonoid: MonoidT<TryT<unknown>> = {
	empty: Either.right(null),
	concat: (try1, try2) =>
		match(try1)
			.when(Either.isRight, () => try2)
			.otherwise(() => try1)
};

describe('Transactions', () => {
	let apiServer: ApiServer;
	beforeEach(() => {
		apiServer = newApiServer();
	});

	afterEach(() => {
		apiServer.server.shutdown();
	});

	it('loads and displays transactions', async () => {
		renderApp({
			initialPath: '/expense-tracker/transactions'
		});
		await waitFor(() =>
			expect(screen.queryByText('Expense Tracker')).toBeVisible()
		);
		await waitFor(() =>
			expect(screen.queryAllByText('Manage Transactions')).toHaveLength(2)
		);

		expect(screen.queryByText('Expense Date')).toBeVisible();
		expect(screen.queryByText('Description')).toBeVisible();
		expect(screen.queryByText('Amount')).toBeVisible();

		await waitFor(() =>
			expect(screen.queryByText('Rows per page:')).toBeVisible()
		);

		expect(screen.queryByText('Transaction 0')).toBeVisible();
		expect(screen.queryByText('Transaction 1')).toBeVisible();
		expect(screen.queryByText('Transaction 2')).toBeVisible();

		const result = pipe(
			RNonEmptyArray.range(0, 25),
			RNonEmptyArray.map((index) => `Transaction ${index}`),
			RNonEmptyArray.map((description) =>
				pipe(
					Try.tryCatch(() =>
						expect(screen.queryByText(description)).toBeVisible()
					),
					Either.mapLeft(
						(ex) =>
							new Error(
								`Error validating ${description}. ${ex.message}`,
								{
									cause: ex
								}
							)
					)
				)
			),
			Monoid.concatAll(validationMonoid)
		);
		if (Either.isLeft<Error>(result)) {
			throw result.left;
		}
	});

	it('can change the rows-per-page and automatically re-load the data', async () => {
		renderApp({
			initialPath: '/expense-tracker/transactions'
		});
		await waitFor(() =>
			expect(screen.queryByText('Expense Tracker')).toBeVisible()
		);
		await waitFor(() =>
			expect(screen.queryAllByText('Manage Transactions')).toHaveLength(2)
		);
		throw new Error();
	});

	it('can paginate and load the correct data successfully', async () => {
		renderApp({
			initialPath: '/expense-tracker/transactions'
		});
		await waitFor(() =>
			expect(screen.queryByText('Expense Tracker')).toBeVisible()
		);
		await waitFor(() =>
			expect(screen.queryAllByText('Manage Transactions')).toHaveLength(2)
		);
		throw new Error();
	});
});
