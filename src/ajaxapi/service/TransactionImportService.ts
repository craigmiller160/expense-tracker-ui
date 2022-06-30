import { FileType } from '../../types/file';
import { expenseTrackerApi } from './AjaxApi';

export const importTransactions = (type: FileType, file: File) => {
	const form = new FormData();
	form.append('file', file);
	return expenseTrackerApi.post<FormData, unknown>({
		uri: `transaction-import?type=${type}`,
		errorCustomizer: 'Error importing transaction'
	});
};
