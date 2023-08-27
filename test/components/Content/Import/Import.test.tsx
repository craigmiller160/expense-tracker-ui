import { render, screen, waitFor } from '@testing-library/react';
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

const doRender = async () => {
	render(<Import useImportTransactions={useImportTransactions} />);
	await waitFor(() => screen.getByText('Import Transactions'));
};

describe('Transaction Import', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('imports file successfully', async () => {
		await doRender();

		const fileInput = screen.getByLabelText('Transaction File');
		await userEvent.upload(fileInput, file);
		await waitFor(() =>
			expect(fileInput).toHaveValue('C:\\fakepath\\Test.txt')
		);

		await userEvent.click(screen.getByRole('button', { name: 'Import' }));
		await waitFor(() => expect(fileInput).toHaveValue(''));
		expect(mutate).toHaveBeenCalled();
	});

	it('can change the import file type', async () => {
		throw new Error();
	});

	it('prevents import of improperly filled out form', async () => {
		await doRender();

		const autocomplete = screen.getByLabelText('File Type');
		const clearButton = autocomplete.parentElement?.querySelector(
			'.MuiAutocomplete-clearIndicator'
		);
		expect(clearButton).toBeTruthy();
		if (clearButton) {
			await userEvent.click(clearButton);
		}

		await userEvent.click(screen.getByRole('button', { name: 'Import' }));

		await waitFor(() =>
			expect(screen.queryByText('File is required')).toBeVisible()
		);
		expect(screen.queryByText('File Type is required')).toBeVisible();
	});
});
