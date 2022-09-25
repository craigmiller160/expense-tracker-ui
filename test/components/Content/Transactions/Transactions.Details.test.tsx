import { renderApp } from '../../../testutils/renderApp';
import { screen, waitFor, within } from '@testing-library/react';
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
		await waitFor(() =>
			expect(screen.queryByText('Expense Tracker')).toBeVisible()
		);
		await waitFor(() =>
			expect(screen.queryAllByText('Manage Transactions')).toHaveLength(2)
		);
		await waitFor(() =>
			expect(screen.queryByText('Rows per page:')).toBeVisible()
		);

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

		expect(
			within(transactionDialog).getByTestId('duplicate-icon').className
		).not.toMatch(/visible/);
		expect(
			within(transactionDialog).getByTestId('not-confirmed-icon')
				.className
		).toMatch(/visible/);
		expect(
			within(transactionDialog).getByTestId('no-category-icon').className
		).toMatch(/visible/);
		// TODO check controls
	});

	it('shows current transaction information for confirmed & categorized', async () => {
		throw new Error();
	});

	it('can confirm transaction', async () => {
		// TODO don't forget to verify flag change
		throw new Error();
	});

	it('can categorize transaction', async () => {
		// TODO don't forget to verify flag change
		throw new Error();
	});

	it('can delete transaction', async () => {
		throw new Error();
	});

	it('cannot open details dialog when table form is dirty', async () => {
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
