import { renderApp } from '../../../testutils/renderApp';
import {
	screen,
	waitFor,
	waitForElementToBeRemoved,
	within
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { searchForTransactions } from '../../../../src/ajaxapi/service/TransactionService';
import { TransactionSortKey } from '../../../../src/types/transactions';
import { SortDirection } from '../../../../src/types/misc';
import { formatDisplayDate } from '../../../../src/components/Content/Transactions/useHandleTransactionTableData';
import {
	defaultEndDate,
	defaultStartDate
} from '../../../../src/components/Content/Transactions/utils';
import { apiServer } from '../../../server';
import { getAllCategories } from '../../../../src/ajaxapi/service/CategoryService';
import { materialUiSelect } from '../../../testutils/dom-actions/material-ui-select';
import { transactionIcon } from '../../../testutils/dom-actions/transaction-icon';
import { waitForVisibility } from '../../../testutils/dom-actions/wait-for-visibility';
import '@relmify/jest-fp-ts';
import { materialUiCheckbox } from '../../../testutils/dom-actions/material-ui-checkbox';

const testButton =
	(isDisabled: boolean) => (detailsButton: HTMLElement, index: number) => {
		try {
			if (isDisabled) {
				expect(detailsButton).toBeDisabled();
			} else {
				expect(detailsButton).toBeEnabled();
			}
		} catch (ex) {
			throw new Error(`Error testing details button at index ${index}`, {
				cause: ex as Error
			});
		}
	};

const createTestFormValidation =
	(dialog: HTMLElement) =>
	async (labelText: string, errorMessage: string, updatedValue: string) => {
		const formControl = within(dialog).getByLabelText(labelText);
		const saveButton = within(dialog).getByText('Save');

		await userEvent.clear(formControl);
		expect(formControl).toHaveValue('');
		await waitFor(() =>
			expect(within(dialog).getByText(errorMessage)).toBeVisible()
		);
		expect(saveButton).toBeDisabled();

		await userEvent.type(formControl, updatedValue);
		expect(formControl).toHaveValue(updatedValue);
		expect(
			within(dialog).queryByText(errorMessage)
		).not.toBeInTheDocument();
		expect(saveButton).toBeEnabled();
	};

describe('Transaction Details Dialog', () => {
	it('shows current transaction information for unconfirmed and uncategorized', async () => {
		await renderApp({
			initialPath: '/expense-tracker/transactions'
		});
		await waitForVisibility([
			{ text: 'Expense Tracker' },
			{ text: 'Manage Transactions', occurs: 2 },
			{ text: 'Rows per page:' }
		]);

		const {
			transactions: [transaction]
		} = await searchForTransactions({
			startDate: defaultStartDate(),
			endDate: defaultEndDate(),
			pageNumber: 0,
			pageSize: 25,
			sortKey: TransactionSortKey.EXPENSE_DATE,
			sortDirection: SortDirection.DESC
		});

		const row = screen.getAllByTestId('transaction-table-row')[0];
		const detailsButton = within(row).getByText('Details');
		await userEvent.click(detailsButton);

		const transactionDialog = screen.getByTestId(
			'transaction-details-dialog'
		);
		expect(
			within(transactionDialog).getByLabelText('Expense Date')
		).toHaveValue(formatDisplayDate(transaction.expenseDate));
		expect(
			within(transactionDialog).getByLabelText('Amount ($)')
		).toHaveValue(transaction.amount.toFixed(2));
		expect(
			within(transactionDialog).getByLabelText('Description')
		).toHaveValue(transaction.description);

		transactionIcon('duplicate-icon', transactionDialog).isNotVisible();
		transactionIcon('not-confirmed-icon', transactionDialog).isVisible();
		transactionIcon('no-category-icon', transactionDialog).isVisible();

		expect(within(transactionDialog).getByText('Save')).toBeDisabled();

		await materialUiCheckbox({
			selector: 'confirm-transaction-checkbox',
			type: 'testid',
			root: transactionDialog
		}).isNotChecked();

		await materialUiSelect('Category', transactionDialog).hasValue('');
	});

	it('shows current transaction information for confirmed & categorized', async () => {
		const {
			transactions: [transaction]
		} = await searchForTransactions({
			startDate: defaultStartDate(),
			endDate: defaultEndDate(),
			pageNumber: 0,
			pageSize: 25,
			sortKey: TransactionSortKey.EXPENSE_DATE,
			sortDirection: SortDirection.DESC
		});
		const [category] = await getAllCategories();
		apiServer.database.updateData((data) => {
			data.transactions[transaction.id].confirmed = true;
			data.transactions[transaction.id].categoryId = category.id;
			data.transactions[transaction.id].categoryName = category.name;
		});

		await renderApp({
			initialPath: '/expense-tracker/transactions'
		});
		await waitForVisibility([
			{ text: 'Expense Tracker' },
			{ text: 'Manage Transactions', occurs: 2 },
			{ text: 'Rows per page:' }
		]);

		const row = screen.getAllByTestId('transaction-table-row')[0];
		const detailsButton = within(row).getByText('Details');
		await userEvent.click(detailsButton);

		const transactionDialog = screen.getByTestId(
			'transaction-details-dialog'
		);
		expect(
			within(transactionDialog).getByLabelText('Expense Date')
		).toHaveValue(formatDisplayDate(transaction.expenseDate));
		expect(
			within(transactionDialog).getByLabelText('Amount ($)')
		).toHaveValue(transaction.amount.toFixed(2));
		expect(
			within(transactionDialog).getByLabelText('Description')
		).toHaveValue(transaction.description);

		transactionIcon('duplicate-icon', transactionDialog).isNotVisible();
		transactionIcon('not-confirmed-icon', transactionDialog).isNotVisible();
		transactionIcon('no-category-icon', transactionDialog).isNotVisible();

		expect(within(transactionDialog).getByText('Save')).toBeDisabled();

		const checkbox = materialUiCheckbox({
			selector: 'confirm-transaction-checkbox',
			type: 'testid',
			root: transactionDialog
		});
		checkbox.isChecked();

		materialUiSelect('Category', transactionDialog).hasValue(category.name);
	});

	it('input field validation rules work', async () => {
		await renderApp({
			initialPath: '/expense-tracker/transactions'
		});
		await waitForVisibility([
			{ text: 'Expense Tracker' },
			{ text: 'Manage Transactions', occurs: 2 },
			{ text: 'Rows per page:' }
		]);

		const row = screen.getAllByTestId('transaction-table-row')[0];
		const detailsButton = within(row).getByText('Details');
		await userEvent.click(detailsButton);

		const transactionDialog = screen.getByTestId(
			'transaction-details-dialog'
		);

		const testFormValidation = createTestFormValidation(transactionDialog);
		await testFormValidation(
			'Expense Date',
			'Expense Date is required',
			'01/01/2022'
		);
		await testFormValidation('Amount ($)', 'Amount is required', '10.00');
		await testFormValidation(
			'Description',
			'Description is required',
			'Hello World'
		);
	});

	it('can confirm transaction', async () => {
		await renderApp({
			initialPath: '/expense-tracker/transactions'
		});
		await waitForVisibility([
			{ text: 'Expense Tracker' },
			{ text: 'Manage Transactions', occurs: 2 },
			{ text: 'Rows per page:' }
		]);

		const row = screen.getAllByTestId('transaction-table-row')[0];
		const detailsButton = within(row).getByText('Details');
		await userEvent.click(detailsButton);

		expect(
			within(row).queryByTestId('confirm-transaction-checkbox')
		).toBeInTheDocument();

		const transactionDialog = screen.getByTestId(
			'transaction-details-dialog'
		);

		const checkbox = materialUiCheckbox({
			selector: 'confirm-transaction-checkbox',
			type: 'testid',
			root: transactionDialog
		});
		checkbox.click();
		await checkbox.isChecked();
		transactionIcon('not-confirmed-icon', transactionDialog).isNotVisible();

		await userEvent.click(within(transactionDialog).getByText('Save'));

		await waitForElementToBeRemoved(() =>
			screen.queryByTestId('transaction-details-dialog')
		);
		await waitFor(() =>
			expect(screen.getAllByTestId('transaction-table-row')).toHaveLength(
				25
			)
		);
		expect(
			within(row).queryByTestId('confirm-transaction-checkbox')
		).not.toBeInTheDocument();
	});

	it('can update transaction information', async () => {
		const {
			transactions: [transaction]
		} = await searchForTransactions({
			startDate: defaultStartDate(),
			endDate: defaultEndDate(),
			pageNumber: 0,
			pageSize: 25,
			sortKey: TransactionSortKey.EXPENSE_DATE,
			sortDirection: SortDirection.DESC
		});

		await renderApp({
			initialPath: '/expense-tracker/transactions'
		});
		await waitForVisibility([
			{ text: 'Expense Tracker' },
			{ text: 'Manage Transactions', occurs: 2 },
			{ text: 'Rows per page:' }
		]);

		const row = screen.getAllByTestId('transaction-table-row')[0];
		const detailsButton = within(row).getByText('Details');
		await userEvent.click(detailsButton);

		const transactionDialog = screen.getByTestId(
			'transaction-details-dialog'
		);

		await userEvent.type(
			within(transactionDialog).getByLabelText('Expense Date'),
			'01/01/2022'
		);
		await userEvent.type(
			within(transactionDialog).getByLabelText('Amount ($)'),
			'145.22'
		);
		await userEvent.type(
			within(transactionDialog).getByLabelText('Description'),
			'Hello World'
		);
		await userEvent.click(within(transactionDialog).getByText('Save'));

		await waitForElementToBeRemoved(() =>
			screen.queryByTestId('transaction-details-dialog')
		);
		await waitFor(() =>
			expect(screen.getAllByTestId('transaction-table-row')).toHaveLength(
				25
			)
		);

		const matchingTransaction =
			apiServer.database.data.transactions[transaction.id];
		expect(matchingTransaction).not.toBeUndefined();
		expect(matchingTransaction).toEqual(
			expect.objectContaining({
				expenseDate: '2022-01-01',
				description: 'Hello World',
				amount: 145.22
			})
		);
	});

	it('can categorize transaction', async () => {
		await renderApp({
			initialPath: '/expense-tracker/transactions'
		});
		await waitForVisibility([
			{ text: 'Expense Tracker' },
			{ text: 'Manage Transactions', occurs: 2 },
			{ text: 'Rows per page:' }
		]);

		const row = screen.getAllByTestId('transaction-table-row')[0];
		const detailsButton = within(row).getByText('Details');
		await userEvent.click(detailsButton);

		const transactionDialog = screen.getByTestId(
			'transaction-details-dialog'
		);

		const categorySelect = materialUiSelect('Category', transactionDialog);
		await categorySelect.selectItem('Groceries');
		await categorySelect.hasValue('Groceries');

		transactionIcon('no-category-icon', transactionDialog).isNotVisible();
		await userEvent.click(within(transactionDialog).getByText('Save'));

		await waitForElementToBeRemoved(() =>
			screen.queryByTestId('transaction-details-dialog')
		);
		await waitFor(() => screen.queryByTestId('table-loading'));
		await waitFor(() =>
			expect(screen.getAllByTestId('transaction-table-row')).toHaveLength(
				25
			)
		);
		const rowAfterReload = screen.getAllByTestId(
			'transaction-table-row'
		)[0];
		await materialUiSelect('Category', rowAfterReload).hasValue(
			'Groceries'
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
			sortDirection: SortDirection.DESC
		});
		apiServer.database.updateData((draft) => {
			draft.transactions[transaction.id].amount = transaction.amount * -1;
		});

		await renderApp({
			initialPath: '/expense-tracker/transactions'
		});
		await waitForVisibility([
			{ text: 'Expense Tracker' },
			{ text: 'Manage Transactions', occurs: 2 },
			{ text: 'Rows per page:' }
		]);

		const allRows = screen.getAllByTestId('transaction-table-row');

		const detailsButton1 = within(allRows[0]).getByText('Details');
		await userEvent.click(detailsButton1);
		const transactionDialog1 = screen.getByTestId(
			'transaction-details-dialog'
		);
		transactionIcon('possible-refund-icon', transactionDialog1).isVisible();

		await userEvent.click(
			within(transactionDialog1).getByTestId('CloseIcon')
		);

		const detailsButton2 = within(allRows[1]).getByText('Details');
		await userEvent.click(detailsButton2);
		const transactionDialog2 = screen.getByTestId(
			'transaction-details-dialog'
		);
		transactionIcon(
			'possible-refund-icon',
			transactionDialog2
		).isNotVisible();
	});

	it('can delete transaction', async () => {
		const {
			transactions: [transaction]
		} = await searchForTransactions({
			startDate: defaultStartDate(),
			endDate: defaultEndDate(),
			pageNumber: 0,
			pageSize: 25,
			sortKey: TransactionSortKey.EXPENSE_DATE,
			sortDirection: SortDirection.DESC
		});

		await renderApp({
			initialPath: '/expense-tracker/transactions'
		});
		await waitForVisibility([
			{ text: 'Expense Tracker' },
			{ text: 'Manage Transactions', occurs: 2 },
			{ text: 'Rows per page:' }
		]);

		expect(screen.queryByText(transaction.description)).toBeInTheDocument();

		const row = screen.getAllByTestId('transaction-table-row')[0];
		const detailsButton = within(row).getByText('Details');
		await userEvent.click(detailsButton);

		const transactionDialog = screen.getByTestId(
			'transaction-details-dialog'
		);

		const deleteButton = within(transactionDialog).getByText('Delete');
		await userEvent.click(deleteButton);

		const confirmDialog = screen.getByTestId('confirm-dialog');
		const confirmButton = within(confirmDialog).getByText('Confirm');
		await userEvent.click(confirmButton);

		// Confirming description is not here twice to handle the loading pause
		await waitForElementToBeRemoved(() =>
			screen.queryByText(transaction.description)
		);
		await waitFor(() =>
			expect(screen.getAllByTestId('transaction-table-row')).toHaveLength(
				25
			)
		);
		await waitFor(() =>
			expect(
				screen.queryByText(transaction.description)
			).not.toBeInTheDocument()
		);
	});

	it('cannot open details dialog when table form is dirty', async () => {
		await renderApp({
			initialPath: '/expense-tracker/transactions'
		});
		await waitForVisibility([
			{ text: 'Expense Tracker' },
			{ text: 'Manage Transactions', occurs: 2 },
			{ text: 'Rows per page:' }
		]);
		const row = screen.getAllByTestId('transaction-table-row')[0];
		const confirmCheckbox = within(row).getByTestId(
			'confirm-transaction-checkbox'
		);

		const detailsButtons = screen
			.getAllByText('Details')
			.filter((item) => item instanceof HTMLButtonElement);
		expect(detailsButtons).toHaveLength(25);
		detailsButtons.forEach(testButton(false));

		await userEvent.click(confirmCheckbox);
		expect(confirmCheckbox.querySelector('input')).toBeChecked();

		detailsButtons.forEach(testButton(true));
	});
});
