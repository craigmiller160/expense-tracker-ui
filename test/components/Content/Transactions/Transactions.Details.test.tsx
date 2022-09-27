import { renderApp } from '../../../testutils/renderApp';
import { screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { searchForTransactions } from '../../../../src/ajaxapi/service/TransactionService';
import { TransactionSortKey } from '../../../../src/types/transactions';
import { SortDirection } from '../../../../src/types/misc';
import { formatDisplayDate } from '../../../../src/components/Content/Transactions/useHandleTransactionTableData';
import { formatCurrency } from '../../../../src/utils/formatCurrency';
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
import { textExists } from '../../../testutils/dom-actions/text-exists';

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
		within(transactionDialog).getByText('Transaction Details');
		within(transactionDialog).getByText('Expense Date');
		within(transactionDialog).getByText('Amount');
		within(transactionDialog).getByText(
			formatDisplayDate(transaction.expenseDate)
		);
		within(transactionDialog).getByText(transaction.description);
		within(transactionDialog).getByText(formatCurrency(transaction.amount));

		transactionIcon('duplicate-icon').isNotVisible();
		transactionIcon('not-confirmed-icon').isVisible();
		transactionIcon('no-category-icon').isVisible();

		const checkbox = within(transactionDialog).getByTestId(
			'confirm-transaction-checkbox'
		);
		expect(checkbox.querySelector('input')).not.toBeChecked();

		const categorySelect =
			within(transactionDialog).getByLabelText('Category');
		expect(categorySelect).toHaveValue('');
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
		textExists(
			[
				{ text: 'Transaction Details' },
				{ text: 'Expense Date' },
				{ text: 'Amount' },
				{ text: formatDisplayDate(transaction.expenseDate) },
				{ text: transaction.description },
				{ text: formatCurrency(transaction.amount) }
			],
			transactionDialog
		);

		transactionIcon('duplicate-icon', transactionDialog).isNotVisible();
		transactionIcon('not-confirmed-icon', transactionDialog).isNotVisible();
		transactionIcon('no-category-icon', transactionDialog).isNotVisible();

		const checkbox = materialUiCheckbox({
			selector: 'confirm-transaction-checkbox',
			type: 'testid',
			root: transactionDialog
		});
		checkbox.isChecked();

		materialUiSelect('Category', transactionDialog).hasValue(category.name);
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

		const transactionDialog = screen.getByTestId(
			'transaction-details-dialog'
		);

		const checkbox = within(transactionDialog).getByTestId(
			'confirm-transaction-checkbox'
		);
		await userEvent.click(checkbox);
		expect(checkbox.querySelector('input')).toBeChecked();
		transactionIcon('not-confirmed-icon').isNotVisible();
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
		categorySelect.hasValue('Groceries');

		transactionIcon('no-category-icon').isNotVisible();
	});

	it('can delete transaction', async () => {
		throw new Error();
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
