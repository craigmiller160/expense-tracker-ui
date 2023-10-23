import { FileType } from '../../types/file';
import type { UseMutateFunction } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { importTransactions } from '../service/TransactionImportService';
import type { ImportTransactionsResponse } from '../../types/generated/expense-tracker';
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
	useMutation<ImportTransactionsResponse, Error, ImportTransactionsParams>({
		mutationFn: ({ type, file }) => importTransactions(type, file),
		onSuccess: (data: ImportTransactionsResponse) => {
			onSuccess();
			alertManager.addAlert(
				'success',
				`Successfully imported ${data.transactionsImported} transactions`
			);
		}
	});

export type UseImportTransactionsType = typeof useImportTransactions;
