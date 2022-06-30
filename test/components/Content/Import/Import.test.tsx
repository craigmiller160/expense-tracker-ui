import { ApiServer, newApiServer } from '../../../server';

describe('Transaction Import', () => {
	let apiServer: ApiServer;
	beforeEach(() => {
		apiServer = newApiServer();
	});

	afterEach(() => {
		apiServer.server.shutdown();
	});

	it('imports file successfully', async () => {
		throw new Error();
	});

	it('displays error for invalid import', async () => {
		throw new Error();
	});

	it('prevents import of improperly filled out form', async () => {
		throw new Error();
	});
});
