import { ApiServer, newApiServer } from '../../../server';
import { renderApp } from '../../../testutils/renderApp';
import { screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as RNonEmptyArray from 'fp-ts/es6/ReadonlyNonEmptyArray';
import { pipe } from 'fp-ts/es6/function';
import * as Try from '@craigmiller160/ts-functions/es/Try';
import { MonoidT, TryT } from '@craigmiller160/ts-functions/es/types';
import * as Either from 'fp-ts/es6/Either';
import { match } from 'ts-pattern';
import * as Monoid from 'fp-ts/es6/Monoid';
import userEvent from '@testing-library/user-event';

const validationMonoid: MonoidT<TryT<unknown>> = {
	empty: Either.right(null),
	concat: (try1, try2) =>
		match(try1)
			.when(Either.isRight, () => try2)
			.otherwise(() => try1)
};

const validateTransactionElements = (
	startInclusive: number,
	endInclusive: number
) => {
	const result = pipe(
		RNonEmptyArray.range(startInclusive, endInclusive),
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
};

const validateNumberOfTransactions = (expectedCount: number) =>
	expect(screen.queryAllByText(/Transaction \d+/)).toHaveLength(
		expectedCount
	);

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

		validateNumberOfTransactions(25);
		validateTransactionElements(0, 24);
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

		await waitFor(() =>
			expect(screen.queryByText('Rows per page:')).toBeVisible()
		);

		validateNumberOfTransactions(25);

		const rowsPerPageSelect = screen
			.getByTestId('table-pagination')
			.querySelector('div.MuiTablePagination-select');
		expect(rowsPerPageSelect).toBeVisible();
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		userEvent.click(rowsPerPageSelect!);

		await waitFor(() =>
			// Must be 2 because there is an Amount = 10
			expect(screen.queryAllByText('10')).toHaveLength(2)
		);
		userEvent.click(screen.getAllByText('10')[1]);

		await waitFor(() =>
			expect(screen.queryByText('Rows per page:')).toBeVisible()
		);

		await waitFor(() => validateNumberOfTransactions(10));
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

		await waitFor(() =>
			expect(screen.queryByText('Rows per page:')).toBeVisible()
		);

		validateNumberOfTransactions(25);
		validateTransactionElements(0, 24);
		expect(screen.queryByText(/.*1–25 of 100.*/)).toBeVisible();

		const nextPageButton = screen
			.getByTestId('table-pagination')
			.querySelector('button[title="Go to next page"]');
		expect(nextPageButton).toBeVisible();
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		userEvent.click(nextPageButton!);

		await waitFor(() =>
			expect(screen.queryByText('Rows per page:')).toBeVisible()
		);
		await waitFor(() =>
			expect(screen.queryByText(/.*26–50 of 100.*/)).toBeVisible()
		);
		validateNumberOfTransactions(25);
		validateTransactionElements(25, 49);
	});

	it('can set categories on transactions', async () => {
		throw new Error();
	});

	it('can reset in-progress changes on transactions', async () => {
		throw new Error();
	});
});
