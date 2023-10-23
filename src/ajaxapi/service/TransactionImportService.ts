import { FileType } from '../../types/file';
import { expenseTrackerApi, getData } from './AjaxApi';
import type { ImportTransactionsResponse } from '../../types/generated/expense-tracker';

export const importTransactions = (type: FileType, file: File) => {
	const form = new FormData();
	form.append('file', file, file.name);
	return expenseTrackerApi
		.post<ImportTransactionsResponse, FormData>({
			uri: `transaction-import?type=${type}`,
			errorCustomizer: 'Error importing transaction',
			body: form
		})
		.then(getData);
};
