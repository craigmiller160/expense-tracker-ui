import { Database, USER_ID } from './Database';
import * as Option from 'fp-ts/es6/Option';
import { Server } from 'miragejs/server';
import { createServer } from 'miragejs';
import { createOAuthRoutes } from './routes/oauth';
import { seedCategories } from './seedData/categories';
import { createCategoriesRoutes } from './routes/categories';
import { createImportRoutes } from './routes/import';
import { seedTransactions } from './seedData/transactions';
import { createTransactionsRoutes } from './routes/transactions';
import { createNeedsAttentionRoutes } from './routes/needsAttention';

interface ApiServerActions {
	readonly clearDefaultUser: () => void;
	readonly setInitialData: () => void;
}

export interface ApiServer {
	readonly server: Server;
	readonly database: Database;
	readonly actions: ApiServerActions;
}

const createClearDefaultUser = (database: Database) => () =>
	database.updateData((draft) => {
		draft.authUser = Option.none;
	});

const createSetInitialData = (database: Database) => () =>
	database.updateData((draft) => {
		draft.authUser = Option.some({
			userId: USER_ID,
			username: '',
			firstName: '',
			lastName: '',
			roles: []
		});
		seedCategories(draft);
		seedTransactions(draft);
	});

const database = new Database();

const server: Server = createServer({
	routes() {
		this.namespace = '/expense-tracker/api';
		createOAuthRoutes(database, this);
		createCategoriesRoutes(database, this);
		createImportRoutes(database, this);
		createTransactionsRoutes(database, this);
		createNeedsAttentionRoutes(database, this);
	},
	timing: 0
});

export const apiServer: ApiServer = {
	server,
	database,
	actions: {
		clearDefaultUser: createClearDefaultUser(database),
		setInitialData: createSetInitialData(database)
	}
};
