import type { ErrorResponse } from '../../../src/types/error';
import type { HttpHandler, PathParams, DefaultBodyType } from 'msw';
import { http, HttpResponse } from 'msw';
import { match } from 'ts-pattern';
import { FileType } from '../../../src/types/file';
import type { ImportTransactionsResponse } from '../../../src/types/generated/expense-tracker';

const error: ErrorResponse = {
	timestamp: '123',
	path: '/transaction-import',
	message: 'Invalid CSV import',
	method: 'POST',
	status: 400
};

const transactionImportHandler: HttpHandler = http.post<
	PathParams,
	DefaultBodyType,
	ImportTransactionsResponse | ErrorResponse
>('http://localhost/expense-tracker/api/transaction-import', ({ request }) => {
	const url = new URL(request.url);
	const type = url.searchParams.get('type') as FileType;
	return match(type)
		.with(FileType.CHASE_CSV, () =>
			HttpResponse.json<ImportTransactionsResponse>({
				transactionsImported: 10
			})
		)
		.otherwise(() =>
			HttpResponse.json<ErrorResponse>(error, {
				status: 400
			})
		);
});

export const importHandlers: ReadonlyArray<HttpHandler> = [
	transactionImportHandler
];
