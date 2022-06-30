import { ApiServer, newApiServer } from '../../server';

describe('Navbar', () => {
	let apiServer: ApiServer;
	beforeEach(() => {
		apiServer = newApiServer();
	});

	afterEach(() => {
		apiServer.server.shutdown();
	});
	it('renders before authentication', () => {
		throw new Error();
	});

	it('renders after authentication', () => {
		throw new Error();
	});
});
