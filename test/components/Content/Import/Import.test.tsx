import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvents from '@testing-library/user-event';
import { Import } from '../../../../src/components/Content/Import';
import type { UseImportTransactionsType } from '../../../../src/ajaxapi/query/TransactionImportQueries';
import { materialUiSelect } from '../../../testutils/dom-actions/material-ui-select';

const mutate = vi.fn();
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
		mutateAsync: vi.fn(),
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
	await screen.findByText('Import Transactions');
};

describe('Transaction Import', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('imports file successfully', async () => {
		await doRender();

		const fileInput = screen.getByLabelText('Transaction File');
		await userEvents.upload(fileInput, file);
		await waitFor(() =>
			expect(fileInput).toHaveValue('C:\\fakepath\\Test.txt')
		);

		await userEvents.click(screen.getByRole('button', { name: 'Import' }));
		await waitFor(() => expect(fileInput).toHaveValue(''));
		expect(mutate).toHaveBeenCalled();
	});

	// eslint-disable-next-line vitest/expect-expect
	it('can change the import file type', async () => {
		await doRender();

		const { selectItem, hasValue } = materialUiSelect('File Type');
		await hasValue('Chase (CSV)');
		await selectItem('Discover (CSV)');
		await hasValue('Discover (CSV)');
	});

	it('prevents import of improperly filled out form', async () => {
		await doRender();

		const autocomplete = screen.getByLabelText('File Type');
		// eslint-disable-next-line testing-library/no-node-access
		const clearButton = autocomplete.parentElement?.querySelector(
			'.MuiAutocomplete-clearIndicator'
		);
		expect(clearButton).toBeTruthy();
		if (clearButton) {
			await userEvents.click(clearButton);
		}

		await userEvents.click(screen.getByRole('button', { name: 'Import' }));

		await waitFor(() =>
			expect(screen.queryByText('File is required')).toBeVisible()
		);
		expect(screen.queryByText('File Type is required')).toBeVisible();
	});
});
