import { importHandlers } from './handlers/import';
import { needsAttentionHandlers } from './handlers/needsAttention';
// eslint-disable-next-line import/no-unresolved
import { setupServer } from 'msw/node';
import type { SetupServer } from 'msw/node';
import { database, Database } from './Database';
import * as Option from 'fp-ts/Option';
import { seedCategories } from './seedData/categories';
import { seedTransactions } from './seedData/transactions';
import { categoryHandlers } from './handlers/categories';
import { transactionHandlers } from './handlers/transactions';

type MswServerActions = Readonly<{
	clearDefaultUser: () => void;
	startServer: () => void;
	stopServer: () => void;
	resetServer: () => void;
}>;

export type MswServer = Readonly<{
	database: Database;
	actions: MswServerActions;
}>;

const server: SetupServer = setupServer(
	...[
		...importHandlers,
		...needsAttentionHandlers,
		...categoryHandlers,
		...transactionHandlers
	]
);

const clearDefaultUser = () =>
	database.updateData((draft) => {
		draft.authUser = Option.none;
	});

const setInitialData = () =>
	database.updateData((draft) => {
		draft.authUser = Option.some('User');
		seedCategories(draft);
		seedTransactions(draft);
	});

const startServer = () => server.listen({ onUnhandledRequest: 'error' });
const stopServer = () => server.close();
const resetServer = () => {
	server.resetHandlers();
	setInitialData();
};

export const mswServer: MswServer = {
	database,
	actions: {
		clearDefaultUser,
		startServer,
		stopServer,
		resetServer
	}
};
