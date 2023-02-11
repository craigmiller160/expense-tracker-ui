import { FileType } from '../../types/file';
import { UseMutateFunction, useMutation } from '@tanstack/react-query';
import { importTransactions } from '../service/TransactionImportService';
import { ImportTransactionsResponse } from '../../types/generated/expense-tracker';
import { alertManager } from '../../components/UI/Alerts/AlertManager';

interface ImportTransactionsParams {
	readonly type: FileType;
	readonly file: File;
}

export type ImportTransactionsMutation = UseMutateFunction<
	ImportTransactionsResponse,
	Error,
	ImportTransactionsParams
>;

export const useImportTransactions = (onSuccess: () => void) =>
	useMutation<ImportTransactionsResponse, Error, ImportTransactionsParams>(
		({ type, file }) => importTransactions(type, file),
		{
			onSuccess: (data: ImportTransactionsResponse) => {
				onSuccess();
				alertManager.addAlert(
					'success',
					`Successfully imported ${data.transactionsImported} transactions`
				);
			}
		}
	);
