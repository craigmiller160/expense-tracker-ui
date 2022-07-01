import { Database } from '../Database';
import { Server } from 'miragejs/server';
import { Response } from 'miragejs';
import { FileType } from '../../../src/types/file';
import { match } from 'ts-pattern';
import { ImportTransactionsResponse } from '../../../src/types/import';
import { ErrorResponse } from '../../../src/types/error';

const error: ErrorResponse = {
	timestamp: '123',
	path: '/transaction-import',
	message: 'Invalid CSV import',
	method: 'POST',
	status: 400
};

export const createImportRoutes = (database: Database, server: Server) => {
	server.post('/transaction-import', (schema, request) => {
		return match(request.queryParams?.type as FileType)
			.with(
				FileType.CHASE_CSV,
				(): ImportTransactionsResponse => ({
					transactionsImported: 10
				})
			)
			.otherwise(() => new Response(400, undefined, error));
	});
};
