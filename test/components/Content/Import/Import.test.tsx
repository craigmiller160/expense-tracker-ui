import { renderApp } from '../../../testutils/renderApp';
import { screen, waitFor, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { Import } from '../../../../src/components/Content/Import';
import { UseImportTransactionsType } from '../../../../src/ajaxapi/query/TransactionImportQueries';

const mutate = jest.fn();
const file = new File([], 'Test.txt');

const useImportTransactions: UseImportTransactionsType = (onSuccess) => {
	mutate.mockImplementation(() => onSuccess());
	return {
		mutate,
		isLoading: false,
		reset: () => null,
		isError: false,
		failureCount: 0,
		isPaused: false,
		mutateAsync: jest.fn(),
		isSuccess: false,
		data: undefined,
		isIdle: true,
		error: null,
		context: undefined,
		status: 'idle',
		variables: undefined,
		failureReason: null
	};
};

describe('Transaction Import', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('imports file successfully', async () => {
		render(<Import useImportTransactions={useImportTransactions} />);
		await waitFor(() => screen.getByText('Import Transactions'));

		const fileInput = screen.getByLabelText('Transaction File');
		await userEvent.upload(fileInput, file);
		await waitFor(() =>
			expect(fileInput).toHaveValue('C:\\fakepath\\Test.txt')
		);

		await userEvent.click(screen.getByRole('button', { name: 'Import' }));
		await waitFor(() => expect(fileInput).toHaveValue(''));
		expect(mutate).toHaveBeenCalled();
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
