import { FileType } from '../../types/file';
import { expenseTrackerApi, getData } from './AjaxApi';
import { ImportTransactionsResponse } from '../../types/import';

export const importTransactions = (type: FileType, file: File) => {
	const form = new FormData();
	form.append('file', file);
	return expenseTrackerApi
		.post<FormData, ImportTransactionsResponse>({
			uri: `transaction-import?type=${type}`,
			errorCustomizer: 'Error importing transaction',
			body: form
		})
		.then(getData);
};
