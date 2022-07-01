import { ApiServer, newApiServer } from '../../../server';
import { renderApp } from '../../../testutils/renderApp';

describe('Transactions', () => {
	let apiServer: ApiServer;
	beforeEach(() => {
		apiServer = newApiServer();
	});

	afterEach(() => {
		apiServer.server.shutdown();
	});

	it('loads and displays transactions', async () => {
		renderApp({
			initialPath: '/expense-tracker/transactions'
		});
		throw new Error();
	});

	it('can change the rows-per-page and automatically re-load the data', async () => {
		renderApp({
			initialPath: '/expense-tracker/transactions'
		});
		throw new Error();
	});

	it('can paginate and load the correct data successfully', async () => {
		renderApp({
			initialPath: '/expense-tracker/transactions'
		});
		throw new Error();
	});
});
