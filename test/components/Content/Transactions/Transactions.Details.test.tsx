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
import { SortDirection, TransactionSortKey } from '../../../../src/types/misc';
import {
	defaultEndDate,
	defaultStartDate
} from '../../../../src/components/Content/Transactions/utils';
import { waitForVisibility } from '../../../testutils/dom-actions/wait-for-visibility';

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
	it('can delete transaction', async () => {
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

		renderApp({
			initialPath: '/expense-tracker/transactions'
		});
		await waitForVisibility([
			{ text: 'Expense Tracker' },
			{ text: 'Manage Transactions', occurs: 1, timeout: 3000 },
			{ text: 'Rows per page:' }
		]);

		await screen.findByText(transaction.description);

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
		renderApp({
			initialPath: '/expense-tracker/transactions'
		});
		await waitForVisibility([
			{ text: 'Expense Tracker' },
			{ text: 'Manage Transactions', occurs: 1, timeout: 3000 },
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
		// eslint-disable-next-line testing-library/no-node-access
		expect(confirmCheckbox.querySelector('input')).toBeChecked();

		detailsButtons.forEach(testButton(true));
	});
});
