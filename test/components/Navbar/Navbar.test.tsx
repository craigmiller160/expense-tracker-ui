import { ApiServer, newApiServer } from '../../server';

describe('Navbar', () => {
	let apiServer: ApiServer;
	beforeEach(() => {
		apiServer = newApiServer();
	});
	afterEach(() => {
		apiServer.server.shutdown();
	});

	it('is logged in', () => {
		throw new Error();
	});

	it('is not logged in', () => {
		throw new Error();
	});
});
