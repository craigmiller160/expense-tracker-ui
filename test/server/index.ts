import { Database, USER_ID } from './Database';
import * as Option from 'fp-ts/es6/Option';
import { Server } from 'miragejs/server';
import { createServer } from 'miragejs';

interface ApiServerActions {
	readonly clearDefaultUser: () => void;
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

export const newApiServer = (): ApiServer => {
	const database = new Database();
	database.updateData((draft) => {
		draft.authUser = Option.some({
			userId: USER_ID,
			username: '',
			firstName: '',
			lastName: '',
			roles: []
		});
	});

	const server: Server = createServer({
		routes() {
			this.namespace = '/expense-tracker/api';
		}
	});

	return {
		server,
		database,
		actions: {
			clearDefaultUser: createClearDefaultUser(database)
		}
	};
};
