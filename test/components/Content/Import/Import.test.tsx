import { ApiServer, newApiServer } from '../../../server';
import { renderApp } from '../../../testutils/renderApp';
import { screen, waitFor } from '@testing-library/react';
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
			initialPath: '/expense-tracker/import?IS_TEST=true'
		});
		await waitFor(() =>
			expect(screen.queryByText('Expense Tracker')).toBeVisible()
		);
		await waitFor(() =>
			expect(screen.queryAllByText('Import Transactions')).toHaveLength(2)
		);

		userEvent.click(screen.getByText('Import'));
		await waitFor(() =>
			expect(
				screen.getByText('Successfully imported 10 transactions')
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
