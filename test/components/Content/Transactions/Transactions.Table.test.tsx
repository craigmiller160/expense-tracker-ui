import { apiServer } from '../../../server';
import { renderApp } from '../../../testutils/renderApp';
import { screen, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { searchForTransactions } from '../../../../src/ajaxapi/service/TransactionService';
import { SortDirection, TransactionSortKey } from '../../../../src/types/misc';
import { getAllCategories } from '../../../../src/ajaxapi/service/CategoryService';
import { Time } from '@craigmiller160/ts-functions';
import {
	defaultEndDate,
	defaultStartDate
} from '../../../../src/components/Content/Transactions/utils';
import { pipe } from 'fp-ts/function';
import {
	getSelectValueElement,
	getOrderByValueElement,
	getRecordRangeText,
	getTotalDaysInRange,
	validateTransactionsInTable
} from './transactionTestUtils';
import { waitForVisibility } from '../../../testutils/dom-actions/wait-for-visibility';
import { transactionIcon } from '../../../testutils/dom-actions/transaction-icon';
import {
	formatDisplayDate,
	parseServerDate
} from '../../../../src/utils/dateTimeUtils';

const setToMidnight = Time.set({
	hours: 0,
	minutes: 0,
	seconds: 0,
	milliseconds: 0
});

describe('Transactions Table', () => {
	it('loads and displays transactions', async () => {
		renderApp({
			initialPath: '/expense-tracker/transactions'
		});
		await waitForVisibility([
			{ text: 'Expense Tracker' },
			{ text: 'Manage Transactions', occurs: 1 }
		]);

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
		).toHaveValue(formatDisplayDate(defaultStartDate()));
		expect(
			within(transactionFilters).queryByLabelText('End Date')
		).toHaveValue(formatDisplayDate(defaultEndDate()));
		expect(
			within(transactionFilters).queryByLabelText('Category')
		).toBeVisible();
		expect(getSelectValueElement('Category')).toHaveTextContent('');
		expect(
			within(transactionFilters).queryByLabelText('Order By')
		).toBeInTheDocument();
		expect(getOrderByValueElement()).toHaveTextContent('Newest to Oldest');
		expect(
			within(transactionFilters).queryByLabelText('Duplicate')
		).toBeInTheDocument();
		expect(getSelectValueElement('Duplicate')).toHaveTextContent('All');
		expect(
			within(transactionFilters).queryByLabelText('Confirmed')
		).toBeInTheDocument();
		expect(getSelectValueElement('Confirmed')).toHaveTextContent('All');
		expect(
			within(transactionFilters).queryByLabelText('Categorized')
		).toBeInTheDocument();
		expect(getSelectValueElement('Categorized')).toHaveTextContent('All');
		expect(
			within(transactionFilters).queryByLabelText('Possible Refund')
		).toBeInTheDocument();
		expect(getSelectValueElement('Possible Refund')).toHaveTextContent(
			'All'
		);

		await waitFor(() =>
			expect(screen.queryByText('Rows per page:')).toBeVisible()
		);

		await validateTransactionsInTable(25, (index, description) => {
			const expenseDate = pipe(
				parseServerDate(description.expenseDate),
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
			sortDirection: SortDirection.DESC,
			confirmed: 'ALL',
			categorized: 'ALL',
			duplicate: 'ALL',
			possibleRefund: 'ALL'
		});
		const categories = await getAllCategories();
		apiServer.database.updateData((draft) => {
			draft.transactions[transactions[0].id] = {
				...transactions[0],
				categoryId: categories[0].id,
				categoryName: categories[0].name,
				updated: '',
				created: ''
			};
			draft.transactions[transactions[1].id] = {
				...transactions[1],
				confirmed: true,
				updated: '',
				created: ''
			};
			draft.transactions[transactions[2].id] = {
				...transactions[2],
				duplicate: true,
				confirmed: true,
				categoryId: categories[0].id,
				categoryName: categories[0].name,
				updated: '',
				created: ''
			};
		});
		renderApp({
			initialPath: '/expense-tracker/transactions'
		});
		await waitFor(() =>
			expect(screen.queryByText('Expense Tracker')).toBeVisible()
		);
		await waitFor(() =>
			expect(screen.queryAllByText('Manage Transactions')).toHaveLength(1)
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

		const noCategorySelect =
			within(noCategoryRow).getByLabelText('Category');
		expect(noCategorySelect).toHaveValue('');
		await userEvent.click(noCategorySelect);
		await userEvent.click(
			within(screen.getByRole('presentation')).getByText('Entertainment')
		);
		expect(noCategorySelect).toHaveValue('Entertainment');
		await validateRowIcons(noCategoryRow, false, false, false);
	});

	it('can change the rows-per-page and automatically re-load the data', async () => {
		renderApp({
			initialPath: '/expense-tracker/transactions'
		});
		await waitFor(() =>
			expect(screen.queryByText('Expense Tracker')).toBeVisible()
		);
		await waitFor(() =>
			expect(screen.queryAllByText('Manage Transactions')).toHaveLength(1)
		);

		await waitFor(() =>
			expect(screen.queryByText('Rows per page:')).toBeVisible()
		);

		await validateTransactionsInTable(25, (index, description) => {
			const expenseDate = pipe(
				parseServerDate(description.expenseDate),
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

		await validateTransactionsInTable(10, (index, description) => {
			const expenseDate = pipe(
				parseServerDate(description.expenseDate),
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
		renderApp({
			initialPath: '/expense-tracker/transactions'
		});
		await waitForVisibility([
			{ text: 'Expense Tracker' },
			{ text: 'Manage Transactions', occurs: 1, timeout: 3000 },
			{ text: 'Rows per page:' }
		]);

		const totalDaysInRange = getTotalDaysInRange(
			defaultStartDate(),
			defaultEndDate()
		);

		await validateTransactionsInTable(25, (index, description) => {
			const expenseDate = pipe(
				parseServerDate(description.expenseDate),
				setToMidnight
			);
			const startDate = setToMidnight(defaultStartDate());
			const endDate = setToMidnight(defaultEndDate());
			expect(Time.compare(expenseDate)(startDate)).toBeGreaterThanOrEqual(
				0
			);
			expect(Time.compare(expenseDate)(endDate)).toBeLessThanOrEqual(0);
		});
		expect(getRecordRangeText()).toBe(`1-25 of ${totalDaysInRange}`);

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
		expect(getRecordRangeText()).toBe(
			`26-${totalDaysInRange} of ${totalDaysInRange}`
		);
		const expectedSecondPageCount = totalDaysInRange - 25;
		await validateTransactionsInTable(
			expectedSecondPageCount,
			(index, description) => {
				const expenseDate = pipe(
					parseServerDate(description.expenseDate),
					setToMidnight
				);
				const startDate = setToMidnight(defaultStartDate());
				const endDate = setToMidnight(defaultEndDate());
				expect(
					Time.compare(expenseDate)(startDate)
				).toBeGreaterThanOrEqual(0);
				expect(Time.compare(expenseDate)(endDate)).toBeLessThanOrEqual(
					0
				);
			}
		);
	});

	it('shows the icon for possible refund transactions', async () => {
		const {
			transactions: [transaction]
		} = await searchForTransactions({
			startDate: defaultStartDate(),
			endDate: defaultEndDate(),
			pageNumber: 0,
			pageSize: 25,
			sortKey: TransactionSortKey.EXPENSE_DATE,
			sortDirection: SortDirection.DESC,
			confirmed: 'ALL',
			categorized: 'ALL',
			duplicate: 'ALL',
			possibleRefund: 'ALL'
		});
		apiServer.database.updateData((draft) => {
			draft.transactions[transaction.id].amount = transaction.amount * -1;
		});

		renderApp({
			initialPath: '/expense-tracker/transactions'
		});
		await waitForVisibility([
			{ text: 'Expense Tracker' },
			{ text: 'Manage Transactions', occurs: 1 },
			{ text: 'Rows per page:' }
		]);

		const allRows = screen.getAllByTestId('transaction-table-row');

		transactionIcon('possible-refund-icon', allRows[0]).isVisible();
		transactionIcon('possible-refund-icon', allRows[1]).isNotVisible();
	});

	it('can set categories and confirm transactions', async () => {
		renderApp({
			initialPath: '/expense-tracker/transactions'
		});
		await waitFor(() =>
			expect(screen.queryByText('Expense Tracker')).toBeVisible()
		);
		await waitFor(() =>
			expect(screen.queryAllByText('Manage Transactions')).toHaveLength(1)
		);
		await waitFor(() =>
			expect(screen.queryByText('Rows per page:')).toBeVisible()
		);

		const row = screen.getAllByTestId('transaction-table-row')[0];
		const rowCategorySelect = within(row).getByLabelText('Category');

		await userEvent.click(rowCategorySelect);
		expect(screen.queryByText('Groceries')).toBeVisible();
		await userEvent.click(screen.getByText('Groceries'));
		expect(rowCategorySelect).toHaveValue('Groceries');

		const confirmCheckbox = within(row).getByTestId(
			'confirm-transaction-checkbox'
		);
		await userEvent.click(confirmCheckbox);
		// The auto-confirm means that this operation needs to be negated first
		expect(confirmCheckbox.querySelector('input')).not.toBeChecked();
		await userEvent.click(confirmCheckbox);
		expect(confirmCheckbox.querySelector('input')).toBeChecked();

		await userEvent.click(screen.getByText('Save'));
		await waitFor(() =>
			expect(screen.queryByTestId('table-loading')).toBeVisible()
		);
		await waitFor(() =>
			expect(screen.queryByText('Rows per page:')).toBeVisible()
		);
		await waitFor(() =>
			expect(
				screen.queryAllByTestId('transaction-table-row')
			).toHaveLength(25)
		);

		const rowAfterSave = screen.getAllByTestId('transaction-table-row')[0];

		await waitFor(() =>
			expect(within(rowAfterSave).getByLabelText('Category')).toHaveValue(
				'Groceries'
			)
		);

		expect(
			within(rowAfterSave).queryByTestId('confirm-transaction-checkbox')
		).not.toBeInTheDocument();
	});

	it('can remove a category from a transaction', async () => {
		const { transactions } = await searchForTransactions({
			startDate: defaultStartDate(),
			endDate: defaultEndDate(),
			pageNumber: 0,
			pageSize: 25,
			sortKey: TransactionSortKey.EXPENSE_DATE,
			sortDirection: SortDirection.DESC,
			confirmed: 'ALL',
			categorized: 'ALL',
			duplicate: 'ALL',
			possibleRefund: 'ALL'
		});
		const categories = await getAllCategories();
		apiServer.database.updateData((draft) => {
			draft.transactions[transactions[0].id] = {
				...transactions[0],
				categoryId: categories[0].id,
				categoryName: categories[0].name,
				updated: '',
				created: ''
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
			expect(screen.queryAllByText('Manage Transactions')).toHaveLength(1)
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

	it('confirm all checkbox works and can be reset', async () => {
		renderApp({
			initialPath: '/expense-tracker/transactions'
		});
		await waitFor(() =>
			expect(screen.queryByText('Expense Tracker')).toBeVisible()
		);
		await waitFor(() =>
			expect(screen.queryAllByText('Manage Transactions')).toHaveLength(1)
		);
		await waitFor(() =>
			expect(screen.queryByText('Rows per page:')).toBeVisible()
		);

		const validateCheckboxes = (checked: boolean) => {
			const checkboxes = screen.getAllByTestId(
				'confirm-transaction-checkbox'
			);
			checkboxes.forEach((checkbox, index) => {
				// eslint-disable-next-line testing-library/no-node-access
				const realCheckbox = checkbox.querySelector('input');
				try {
					if (checked) {
						expect(realCheckbox).toBeChecked();
					} else {
						expect(realCheckbox).not.toBeChecked();
					}
				} catch (ex) {
					throw new Error(
						`Checkbox ${index} was expected to have checked status of ${checked}. ${
							(ex as Error).message
						}`
					);
				}
			});
		};

		validateCheckboxes(false);

		await userEvent.click(screen.getByLabelText('Confirm All'));
		validateCheckboxes(true);

		await userEvent.click(screen.getAllByText('Reset')[1]);
		validateCheckboxes(false);
	});
});
