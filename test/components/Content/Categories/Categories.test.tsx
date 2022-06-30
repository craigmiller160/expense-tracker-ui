import { ApiServer, newApiServer } from '../../../server';
import { renderApp } from '../../../testutils/renderApp';

describe('Manage Categories', () => {
	let apiServer: ApiServer;
	beforeEach(() => {
		apiServer = newApiServer();
	});

	afterEach(() => {
		apiServer.server.shutdown();
	});
	it('displays all categories on sever', async () => {
		renderApp({
			initialPath: '/expense-tracker/categories'
		});
		throw new Error();
	});

	it('adds new category', async () => {
		renderApp({
			initialPath: '/expense-tracker/categories'
		});
		throw new Error();
	});

	it('updates category name', async () => {
		renderApp({
			initialPath: '/expense-tracker/categories'
		});
		throw new Error();
	});

	it('deletes category', async () => {
		renderApp({
			initialPath: '/expense-tracker/categories'
		});
		throw new Error();
	});
});
