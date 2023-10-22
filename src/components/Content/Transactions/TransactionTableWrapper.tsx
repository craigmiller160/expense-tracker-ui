import type { TransactionSearchForm } from './utils';
import { formToUpdateRequest } from './utils';
import type { TransactionTableForm } from './useHandleTransactionTableData';
import { useHandleTransactionTableData } from './useHandleTransactionTableData';
import './TransactionsTable.scss';
import type { FieldPath, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { useEffect } from 'react';
import type { Updater } from 'use-immer';
import type { UpdateTransactionsMutation } from '../../../ajaxapi/query/TransactionQueries';
import { pipe } from 'fp-ts/function';
import type { PaginationState } from '../../../utils/pagination';
import { TransactionTable } from './TransactionTable';

interface Props {
	readonly pagination: PaginationState;
	readonly onPaginationChange: Updater<PaginationState>;
	readonly filterValues: TransactionSearchForm;
	readonly openDetailsDialog: (transactionId?: string) => void;
}

const createOnSubmit =
	(updateTransactions: UpdateTransactionsMutation) =>
	(values: TransactionTableForm) =>
		pipe(
			formToUpdateRequest(values),
			(_) => ({ transactions: _ }),
			updateTransactions
		);

const CATEGORIZE_TRANSACTION_REGEX = /transactions\.(?<index>\d+)\.category/;
type CategorizeTransactionRegexGroups = {
	readonly index: string;
};
const useAutoConfirmOnCategorize = (
	watch: UseFormWatch<TransactionTableForm>,
	setValue: UseFormSetValue<TransactionTableForm>
) => {
	useEffect(() => {
		const subscription = watch((values, { name }) => {
			if (name) {
				const groups = CATEGORIZE_TRANSACTION_REGEX.exec(name)
					?.groups as CategorizeTransactionRegexGroups | undefined;
				if (groups) {
					const confirmedKey =
						`transactions.${groups.index}.confirmed` as FieldPath<TransactionTableForm>;
					setValue(confirmedKey, true);
				}
			}
		});
		return () => subscription.unsubscribe();
	}, [watch, setValue]);
};

export const TransactionTableWrapper = (props: Props) => {
	const {
		data: { transactions, categories, isFetching },
		pagination,
		form,
		actions: { resetFormToData, updateTransactions }
	} = useHandleTransactionTableData(props.pagination, props.filterValues);
	const {
		formReturn: { setValue, control, watch }
	} = form;

	const onSubmit = createOnSubmit(updateTransactions);

	const { transactions: watchedTransactions = [] } =
		useWatch<TransactionTableForm>({
			control
		});

	useAutoConfirmOnCategorize(watch, setValue);

	return (
		<TransactionTable
			transactions={transactions}
			categories={categories}
			watchedTransactions={watchedTransactions}
			form={form}
			onSubmit={onSubmit}
			isFetching={isFetching}
			openDetailsDialog={props.openDetailsDialog}
			resetFormToData={resetFormToData}
			pagination={pagination}
			onPaginationChange={props.onPaginationChange}
		/>
	);
};
