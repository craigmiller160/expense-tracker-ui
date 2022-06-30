import { ApiServer, newApiServer } from '../../../server';

describe('Manage Categories', () => {
	let apiServer: ApiServer;
	beforeEach(() => {
		apiServer = newApiServer();
	});

	afterEach(() => {
		apiServer.server.shutdown();
	});
	it('displays all categories on sever', async () => {
		throw new Error();
	});

	it('adds new category', async () => {
		throw new Error();
	});

	it('updates category name', async () => {
		throw new Error();
	});

	it('deletes category', async () => {
		throw new Error();
	});
});
