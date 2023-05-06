import { TransactionTableForm } from './useHandleTransactionTableData';
import * as RArray from 'fp-ts/es6/ReadonlyArray';
import { pipe } from 'fp-ts/es6/function';
import { TransactionToUpdate } from '../../../types/generated/expense-tracker';
import { SortDirection } from '../../../types/misc';
import * as Time from '@craigmiller160/ts-functions/es/Time';
import { CategoryOption } from '../../../types/categories';

export interface TransactionSearchForm {
	readonly direction: SortDirection;
	readonly startDate: Date;
	readonly endDate: Date;
	readonly category: CategoryOption | null;
	readonly isNotConfirmed: boolean;
	readonly isDuplicate: boolean;
	readonly isNotCategorized: boolean;
	readonly isPossibleRefund: boolean;
}

export const defaultStartDate = (): Date => Time.subMonths(1)(new Date());
export const defaultEndDate = (): Date => new Date();

export const transactionSearchFormDefaultValues: TransactionSearchForm = {
	direction: SortDirection.DESC,
	startDate: defaultStartDate(),
	endDate: defaultEndDate(),
	category: null,
	isDuplicate: false,
	isNotCategorized: false,
	isNotConfirmed: false,
	isPossibleRefund: false
};

export const DEFAULT_ROWS_PER_PAGE = 25;

export const formToUpdateRequest = (
	values: TransactionTableForm
): ReadonlyArray<TransactionToUpdate> =>
	pipe(
		values.transactions,
		RArray.map(
			(txn): TransactionToUpdate => ({
				transactionId: txn.transactionId,
				categoryId: txn.category?.value,
				confirmed: txn.confirmed
			})
		)
	);
