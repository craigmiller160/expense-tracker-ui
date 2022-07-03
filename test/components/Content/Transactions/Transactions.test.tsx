import { ApiServer, newApiServer } from '../../../server';
import { renderApp } from '../../../testutils/renderApp';
import { screen, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as RNonEmptyArray from 'fp-ts/es6/ReadonlyNonEmptyArray';
import { pipe } from 'fp-ts/es6/function';
import * as Try from '@craigmiller160/ts-functions/es/Try';
import { MonoidT, TryT } from '@craigmiller160/ts-functions/es/types';
import * as Either from 'fp-ts/es6/Either';
import { match } from 'ts-pattern';
import * as Monoid from 'fp-ts/es6/Monoid';
import userEvent from '@testing-library/user-event';
import { searchForTransactions } from '../../../../src/ajaxapi/service/TransactionService';
import { TransactionSortKey } from '../../../../src/types/transactions';
import { SortDirection } from '../../../../src/types/misc';
import { getAllCategories } from '../../../../src/ajaxapi/service/CategoryService';

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
		expect(screen.queryByText('Category')).toBeVisible();

		await waitFor(() =>
			expect(screen.queryByText('Rows per page:')).toBeVisible()
		);

		validateNumberOfTransactions(25);
		validateTransactionElements(0, 24);
		expect(screen.queryAllByLabelText('Category')).toHaveLength(25);
	});

	it('shows the correct icons for transactions', async () => {
		const { transactions } = await searchForTransactions({
			pageNumber: 0,
			pageSize: 25,
			sortKey: TransactionSortKey.EXPENSE_DATE,
			sortDirection: SortDirection.ASC
		});
		apiServer.database.updateData((draft) => {
			draft.transactions[transactions[0].id] = {
				...transactions[0],
				categoryId: '1',
				categoryName: 'One'
			};
			draft.transactions[transactions[1].id] = {
				...transactions[1],
				confirmed: true
			};
			draft.transactions[transactions[2].id] = {
				...transactions[2],
				duplicate: true,
				confirmed: true,
				categoryId: '1',
				categoryName: 'One'
			};
		});
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

		const rows = screen.getAllByTestId('transaction-table-row');
		const validateRowIcons = (
			row: HTMLElement,
			duplicateIcon: boolean,
			notConfirmedIcon: boolean,
			noCategoryIcon: boolean
		) => {
			if (duplicateIcon) {
				expect(
					within(row).getByTestId('duplicate-icon').className
				).toMatch(/visible/);
			} else {
				expect(
					within(row).getByTestId('duplicate-icon').className
				).not.toMatch(/visible/);
			}

			if (notConfirmedIcon) {
				expect(
					within(row).getByTestId('not-confirmed-icon').className
				).toMatch(/visible/);
			} else {
				expect(
					within(row).getByTestId('not-confirmed-icon').className
				).not.toMatch(/visible/);
			}

			if (noCategoryIcon) {
				expect(
					within(row).getByTestId('no-category-icon').className
				).toMatch(/visible/);
			} else {
				expect(
					within(row).getByTestId('no-category-icon').className
				).not.toMatch(/visible/);
			}
		};

		validateRowIcons(rows[0], false, true, false);
		validateRowIcons(rows[1], false, false, true);
		validateRowIcons(rows[2], true, false, false);
		validateRowIcons(rows[3], false, true, true);
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
		await userEvent.click(rowsPerPageSelect!);

		const allItemsWith10 = screen.getAllByText('10');
		if (allItemsWith10.length === 2) {
			await userEvent.click(screen.getAllByText('10')[1]);
		} else {
			await userEvent.click(screen.getAllByText('10')[0]);
		}

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

		await userEvent.click(screen.getAllByLabelText('Category')[2]);
		expect(screen.queryByText('Groceries')).toBeVisible();
		await userEvent.click(screen.getByText('Groceries'));
		expect(screen.getAllByLabelText('Category')[2]).toHaveValue(
			'Groceries'
		);

		await userEvent.click(screen.getByText('Save'));
		await waitFor(() =>
			expect(screen.queryByText('Rows per page:')).toBeVisible()
		);
		expect(screen.getAllByLabelText('Category')[2]).toHaveValue(
			'Groceries'
		);
	});

	it('can remove a category from a transaction', async () => {
		const { transactions } = await searchForTransactions({
			pageNumber: 0,
			pageSize: 25,
			sortKey: TransactionSortKey.EXPENSE_DATE,
			sortDirection: SortDirection.ASC
		});
		const categories = await getAllCategories();
		apiServer.database.updateData((draft) => {
			draft.transactions[transactions[0].id] = {
				...transactions[0],
				categoryId: categories[0].id,
				categoryName: categories[0].name
			};
		});

		const preparedTransaction =
			apiServer.database.data.transactions[transactions[0].id];
		expect(preparedTransaction.categoryId).toEqual(categories[0].id);

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

		const clearButton = screen
			.getAllByTestId('transaction-table-row')[0]
			.querySelector('.MuiAutocomplete-clearIndicator');
		expect(clearButton).toBeTruthy();
		await userEvent.click(clearButton!); // eslint-disable-line @typescript-eslint/no-non-null-assertion

		await userEvent.click(screen.getByText('Save'));

		await waitFor(() =>
			expect(screen.queryByText('Rows per page:')).toBeVisible()
		);

		const modifiedTransaction =
			apiServer.database.data.transactions[transactions[0].id];
		expect(modifiedTransaction.categoryId).toBeUndefined();
	});

	it('can reset in-progress changes on transactions', async () => {
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

		await userEvent.click(screen.getAllByLabelText('Category')[2]);
		expect(screen.queryByText('Groceries')).toBeVisible();
		await userEvent.click(screen.getByText('Groceries'));
		expect(screen.getAllByLabelText('Category')[2]).toHaveValue(
			'Groceries'
		);

		await userEvent.click(screen.getByText('Reset'));
		expect(screen.getAllByLabelText('Category')[2]).toHaveValue('');
	});
});
