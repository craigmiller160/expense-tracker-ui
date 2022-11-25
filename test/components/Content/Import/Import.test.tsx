import { renderApp } from '../../../testutils/renderApp';
import { screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { waitForVisibility } from '../../../testutils/dom-actions/wait-for-visibility';

describe('Transaction Import', () => {
	it('imports file successfully', async () => {
		await renderApp({
			initialPath: '/expense-tracker/import?IS_TEST=true'
		});
		await waitForVisibility([
			{ text: 'Expense Tracker' },
			{ text: 'Import', occurs: 2 },
			{ text: 'Import Transactions' }
		]);

		await userEvent.click(screen.getAllByText('Import')[1]);
		await waitFor(() =>
			expect(
				screen.getByText('Successfully imported 10 transactions')
			).toBeVisible()
		);
	});

	it('displays error for invalid import', async () => {
		await renderApp({
			initialPath: '/expense-tracker/import?IS_TEST=true'
		});
		await waitFor(() =>
			expect(screen.queryByText('Expense Tracker')).toBeVisible()
		);
		await waitFor(() =>
			expect(screen.queryAllByText('Import Transactions')).toHaveLength(1)
		);

		await userEvent.click(screen.getByLabelText('File Type'));
		await waitFor(() =>
			expect(screen.queryByText('Discover (CSV)')).toBeVisible()
		);
		await userEvent.click(screen.getByText('Discover (CSV)'));

		await userEvent.click(screen.getAllByText('Import')[1]);
		await waitFor(() =>
			expect(screen.getByText('Invalid CSV import')).toBeVisible()
		);
	});

	it('prevents import of improperly filled out form', async () => {
		await renderApp({
			initialPath: '/expense-tracker/import'
		});
		await waitFor(() =>
			expect(screen.queryByText('Expense Tracker')).toBeVisible()
		);
		await waitFor(() =>
			expect(screen.queryAllByText('Import Transactions')).toHaveLength(1)
		);

		const autocomplete = screen.getByLabelText('File Type');
		autocomplete.focus();
		const clearButton = autocomplete.parentElement?.querySelector(
			'.MuiAutocomplete-clearIndicator'
		);
		expect(clearButton).toBeTruthy();
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		await userEvent.click(clearButton!);

		await userEvent.click(screen.getAllByText('Import')[1]);

		await waitFor(() =>
			expect(screen.queryByText('File is required')).toBeVisible()
		);
		expect(screen.queryByText('File Type is required')).toBeVisible();
	});
});
