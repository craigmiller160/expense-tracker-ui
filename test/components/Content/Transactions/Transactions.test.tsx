import { ApiServer, newApiServer } from '../../../server';
import { renderApp } from '../../../testutils/renderApp';
import { screen, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as Either from 'fp-ts/es6/Either';
import userEvent from '@testing-library/user-event';
import { searchForTransactions } from '../../../../src/ajaxapi/service/TransactionService';
import {
	DATE_FORMAT,
	TransactionSortKey
} from '../../../../src/types/transactions';
import { SortDirection } from '../../../../src/types/misc';
import { getAllCategories } from '../../../../src/ajaxapi/service/CategoryService';
import * as Time from '@craigmiller160/ts-functions/es/Time';
import {
	defaultEndDate,
	defaultStartDate
} from '../../../../src/components/Content/Transactions/utils';
import * as Json from '@craigmiller160/ts-functions/es/Json';
import { flow, pipe } from 'fp-ts/es6/function';
import * as RArray from 'fp-ts/es6/ReadonlyArray';
import { TestTransactionDescription } from '../../../server/createTransaction';
import * as Try from '@craigmiller160/ts-functions/es/Try';
import { TryT } from '@craigmiller160/ts-functions/es/types';

const DATE_PICKER_FORMAT = 'MM/dd/yyyy';

const parseExpenseDate = Time.parse(DATE_FORMAT);
const setToMidnight = Time.set({
	hours: 0,
	minutes: 0,
	seconds: 0,
	milliseconds: 0
});

type ValidateDescription = (description: TestTransactionDescription) => void;

const validateTransactionDescription =
	(validateDescription: ValidateDescription) =>
	(description: TestTransactionDescription): TryT<unknown> =>
		pipe(
			Try.tryCatch(() => validateDescription(description)),
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

const validateTransactionsInTable = (
	count: number,
	validateDescription: ValidateDescription
) => {
	const descriptions = screen.getAllByTestId('transaction-description');
	expect(descriptions).toHaveLength(count);
	const result = pipe(
		descriptions,
		RArray.filter((_) => _ !== null),
		RArray.map((_) =>
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			Json.parseE<TestTransactionDescription>(_.textContent!)
		),
		Either.sequenceArray,
		Either.chain(
			flow(
				RArray.map(validateTransactionDescription(validateDescription)),
				Either.sequenceArray
			)
		)
	);
	if (Either.isLeft(result)) {
		throw result.left;
	}
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
		await renderApp({
			initialPath: '/expense-tracker/transactions'
		});
		await waitFor(() =>
			expect(screen.queryByText('Expense Tracker')).toBeVisible()
		);
		await waitFor(() =>
			expect(screen.queryAllByText('Manage Transactions')).toHaveLength(2)
		);

		const tableHeader = screen
			.getByTestId('transaction-table')
			.querySelector('thead');
		expect(tableHeader).not.toBeNull();

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(within(tableHeader!).queryByText('Expense Date')).toBeVisible();
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(within(tableHeader!).queryByText('Description')).toBeVisible();
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(within(tableHeader!).queryByText('Amount')).toBeVisible();
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(within(tableHeader!).queryByText('Category')).toBeVisible();

		const transactionFilters = screen.getByTestId('transaction-filters');

		expect(
			within(transactionFilters).queryByLabelText('Start Date')
		).toHaveValue(Time.format(DATE_PICKER_FORMAT)(defaultStartDate()));
		expect(
			within(transactionFilters).queryByLabelText('End Date')
		).toHaveValue(Time.format(DATE_PICKER_FORMAT)(defaultEndDate()));
		expect(
			within(transactionFilters).queryByLabelText('Category')
		).toBeVisible(); // TODO test value
		expect(
			within(transactionFilters).queryByLabelText('Order By')
		).toBeVisible(); // TODO test value
		expect(
			within(transactionFilters).queryByLabelText('Is Duplicate')
		).not.toBeChecked();
		expect(
			within(transactionFilters).queryByLabelText('Is Not Confirmed')
		).not.toBeChecked();
		expect(
			within(transactionFilters).queryByLabelText('Is Not Categorized')
		).not.toBeChecked();

		await waitFor(() =>
			expect(screen.queryByText('Rows per page:')).toBeVisible()
		);

		validateTransactionsInTable(25, (description) => {
			const expenseDate = pipe(
				parseExpenseDate(description.expenseDate),
				setToMidnight
			);
			const startDate = setToMidnight(defaultStartDate());
			const endDate = setToMidnight(defaultEndDate());
			expect(Time.compare(expenseDate)(startDate)).toBeGreaterThanOrEqual(
				0
			);
			expect(Time.compare(expenseDate)(endDate)).toBeLessThanOrEqual(0);
		});
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
		await renderApp({
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
		await renderApp({
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

		// validateNumberOfTransactions(25);

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

		// await waitFor(() => validateNumberOfTransactions(10));
		throw new Error();
	});

	it('can paginate and load the correct data successfully', async () => {
		await renderApp({
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

		// validateNumberOfTransactions(25);
		// validateTransactionElements(0, 24);
		expect(screen.queryByText(/.*1–25 of 100.*/)).toBeVisible();

		const nextPageButton = screen
			.getByTestId('table-pagination')
			.querySelector('button[title="Go to next page"]');
		expect(nextPageButton).toBeVisible();
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		await userEvent.click(nextPageButton!);

		await waitFor(() =>
			expect(screen.queryByText('Rows per page:')).toBeVisible()
		);
		await waitFor(() =>
			expect(screen.queryByText(/.*26–50 of 100.*/)).toBeVisible()
		);
		// validateNumberOfTransactions(25);
		// validateTransactionElements(25, 49);
		throw new Error();
	});

	it('can set categories on transactions', async () => {
		await renderApp({
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

		await renderApp({
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
		await renderApp({
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

	describe('filters', () => {
		it('start date', async () => {
			throw new Error();
		});

		it('end date', async () => {
			throw new Error();
		});

		it('category', async () => {
			throw new Error();
		});

		it('order by', async () => {
			throw new Error();
		});

		it('is duplicate', async () => {
			throw new Error();
		});

		it('is not confirmed', async () => {
			throw new Error();
		});

		it('is not categorized', async () => {
			// TODO should also clear category selection
			throw new Error();
		});
	});
});
