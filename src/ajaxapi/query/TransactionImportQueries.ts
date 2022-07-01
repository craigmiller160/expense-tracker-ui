import { FileType } from '../../types/file';
import { UseMutateFunction, useMutation } from 'react-query';
import { importTransactions } from '../service/TransactionImportService';
import { useContext } from 'react';
import { AlertContext } from '../../components/UI/Alerts/AlertProvider';
import { ImportTransactionsResponse } from '../../types/import';

interface ImportTransactionsParams {
	readonly type: FileType;
	readonly file: File;
}

export type ImportTransactionsMutation = UseMutateFunction<
	ImportTransactionsResponse,
	Error,
	ImportTransactionsParams
>;

export const useImportTransactions = (onSuccess: () => void) => {
	const alertContext = useContext(AlertContext);
	return useMutation<
		ImportTransactionsResponse,
		Error,
		ImportTransactionsParams
	>(({ type, file }) => importTransactions(type, file), {
		onSuccess: (data: ImportTransactionsResponse) => {
			onSuccess();
			alertContext.addAlert(
				'success',
				`Successfully imported ${data.transactionsImported} transactions`
			);
		}
	});
};
