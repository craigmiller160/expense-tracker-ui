import { ApiServer, newApiServer } from '../../../server';
import { renderApp } from '../../../testutils/renderApp';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

describe('Transaction Import', () => {
	let apiServer: ApiServer;
	beforeEach(() => {
		apiServer = newApiServer();
	});

	afterEach(() => {
		apiServer.server.shutdown();
	});

	it('imports file successfully', async () => {
		renderApp({
			initialPath: '/expense-tracker/import'
		});
		await waitFor(() =>
			expect(screen.queryByText('Expense Tracker')).toBeVisible()
		);
		await waitFor(() =>
			expect(screen.queryAllByText('Import Transactions')).toHaveLength(2)
		);

		fireEvent.change(screen.getByTestId('transaction-file-chooser'), {
			target: {
				files: [new File([], 'MyFile.txt')]
			}
		});
		console.log('Debug');
		screen.debug(screen.getByTestId('transaction-file-chooser')); // TODO delete this
		// await waitFor(() =>
		// 	expect(screen.queryByDisplayValue('MyFile.txt')).toBeVisible()
		// );

		userEvent.click(screen.getByText('Import'));
		await waitFor(() =>
			expect(
				screen.getByText('Succesfully imported 10 transactions')
			).toBeVisible()
		);
	});

	it('displays error for invalid import', async () => {
		throw new Error();
	});

	it('prevents import of improperly filled out form', async () => {
		throw new Error();
	});
});
