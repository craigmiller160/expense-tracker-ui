import { ApiServer, newApiServer } from '../../../server';

describe('Transactions', () => {
	let apiServer: ApiServer;
	beforeEach(() => {
		apiServer = newApiServer();
	});

	afterEach(() => {
		apiServer.server.shutdown();
	});

	it('loads and displays transactions', async () => {
		throw new Error();
	});

	it('can change the rows-per-page and automatically re-load the data', async () => {
		throw new Error();
	});

	it('can paginate and load the correct data successfully', async () => {
		throw new Error();
	});
});
