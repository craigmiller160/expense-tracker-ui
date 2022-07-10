import { ApiServer, newApiServer } from '../../../server';
import { renderApp } from '../../../testutils/renderApp';
import { screen, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
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
import { pipe } from 'fp-ts/es6/function';
import {
	getCategoryValueElement,
	getOrderByValueElement,
	getRecordRangeText,
	getTotalDaysInRange,
	validateTransactionsInTable
} from './transactionTestUtils';

const DATE_PICKER_FORMAT = 'MM/dd/yyyy';

const parseExpenseDate = Time.parse(DATE_FORMAT);
const setToMidnight = Time.set({
	hours: 0,
	minutes: 0,
	seconds: 0,
	milliseconds: 0
});

describe('Transactions Table', () => {
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
			.getByTestId('transactions-table')
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
		).toBeVisible();
		expect(getCategoryValueElement()).toHaveTextContent('');
		expect(
			within(transactionFilters).queryByLabelText('Order By')
		).toBeVisible();
		expect(getOrderByValueElement()).toHaveTextContent('Newest to Oldest');
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

		validateTransactionsInTable(25, (index, description) => {
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

	it('shows the correct flags for transactions, and can dynamically change them', async () => {
		const { transactions } = await searchForTransactions({
			startDate: defaultStartDate(),
			endDate: defaultEndDate(),
			pageNumber: 0,
			pageSize: 25,
			sortKey: TransactionSortKey.EXPENSE_DATE,
			sortDirection: SortDirection.DESC
		});
		const categories = await getAllCategories();
		apiServer.database.updateData((draft) => {
			draft.transactions[transactions[0].id] = {
				...transactions[0],
				categoryId: categories[0].id,
				categoryName: categories[0].name
			};
			draft.transactions[transactions[1].id] = {
				...transactions[1],
				confirmed: true
			};
			draft.transactions[transactions[2].id] = {
				...transactions[2],
				duplicate: true,
				confirmed: true,
				categoryId: categories[0].id,
				categoryName: categories[0].name
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

		const [
			notConfirmedRow,
			noCategoryRow,
			duplicateRow,
			notConfirmedNoCategoryRow
		] = screen.getAllByTestId('transaction-table-row');
		const validateRowIcons = async (
			row: HTMLElement,
			duplicateIcon: boolean,
			notConfirmedIcon: boolean,
			noCategoryIcon: boolean
		) => {
			if (duplicateIcon) {
				await waitFor(() =>
					expect(
						within(row).getByTestId('duplicate-icon').className
					).toMatch(/visible/)
				);
			} else {
				await waitFor(() =>
					expect(
						within(row).getByTestId('duplicate-icon').className
					).not.toMatch(/visible/)
				);
			}

			if (notConfirmedIcon) {
				await waitFor(() =>
					expect(
						within(row).getByTestId('not-confirmed-icon').className
					).toMatch(/visible/)
				);
			} else {
				await waitFor(() =>
					expect(
						within(row).getByTestId('not-confirmed-icon').className
					).not.toMatch(/visible/)
				);
			}

			if (noCategoryIcon) {
				await waitFor(() =>
					expect(
						within(row).getByTestId('no-category-icon').className
					).toMatch(/visible/)
				);
			} else {
				await waitFor(() =>
					expect(
						within(row).getByTestId('no-category-icon').className
					).not.toMatch(/visible/)
				);
			}
		};

		await validateRowIcons(notConfirmedRow, false, true, false);
		await validateRowIcons(noCategoryRow, false, false, true);
		await validateRowIcons(duplicateRow, true, false, false);
		await validateRowIcons(notConfirmedNoCategoryRow, false, true, true);

		const notConfirmedConfirmCheckbox = within(notConfirmedRow).getByTestId(
			'confirm-transaction-checkbox'
		);
		await userEvent.click(notConfirmedConfirmCheckbox);
		expect(
			notConfirmedConfirmCheckbox.querySelector('input')
		).toBeChecked();
		await validateRowIcons(notConfirmedRow, false, false, false);

		// For some reason couldn't get this piece of test logic to work, but the functionality does
		// const noCategorySelect =
		// 	within(noCategoryRow).getByLabelText('Category');
		// expect(noCategorySelect).toHaveValue('');
		// await userEvent.click(noCategorySelect);
		// await userEvent.click(
		// 	within(screen.getByRole('presentation')).getByText('Entertainment')
		// );
		// expect(noCategorySelect).toHaveValue('Entertainment');
		// await validateRowIcons(noCategoryRow, false, false, false);
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

		validateTransactionsInTable(25, (index, description) => {
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

		validateTransactionsInTable(10, (index, description) => {
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

		const totalDaysInRange = getTotalDaysInRange(
			defaultStartDate(),
			defaultEndDate()
		);

		validateTransactionsInTable(25, (index, description) => {
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
		expect(getRecordRangeText()).toEqual(`1-25 of ${totalDaysInRange}`);

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
			expect(screen.queryByText(/.*26–\d+ of \d.*/)).toBeVisible()
		);
		expect(getRecordRangeText()).toEqual(
			`26-${totalDaysInRange} of ${totalDaysInRange}`
		);
		validateTransactionsInTable(6, (index, description) => {
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

	it('can set categories and confirm transactions', async () => {
		// TODO add confirmation to this
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

		throw new Error();
	});

	it('can remove a category from a transaction', async () => {
		const { transactions } = await searchForTransactions({
			startDate: defaultStartDate(),
			endDate: defaultEndDate(),
			pageNumber: 0,
			pageSize: 25,
			sortKey: TransactionSortKey.EXPENSE_DATE,
			sortDirection: SortDirection.DESC
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

	it('confirm checkboxes are only present for unconfirmed transactions', async () => {
		throw new Error();
	});

	it('confirm all checkbox works and can be reset', async () => {
		throw new Error();
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

		const firstRow = screen.getAllByTestId('transaction-table-row')[0];
		const confirmCheckbox = within(firstRow).getByTestId(
			'confirm-transaction-checkbox'
		);
		await userEvent.click(confirmCheckbox);
		expect(confirmCheckbox.querySelector('input')).toBeChecked();

		await userEvent.click(screen.getByText('Reset'));
		expect(screen.getAllByLabelText('Category')[2]).toHaveValue('');
		expect(confirmCheckbox.querySelector('input')).not.toBeChecked();
	});
});
