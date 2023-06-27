import { TransactionTableForm } from './useHandleTransactionTableData';
import * as RArray from 'fp-ts/es6/ReadonlyArray';
import { pipe } from 'fp-ts/es6/function';
import { TransactionToUpdate } from '../../../types/generated/expense-tracker';
import { SortDirection, YesNoFilter } from '../../../types/misc';
import * as Time from '@craigmiller160/ts-functions/es/Time';
import { CategoryOption } from '../../../types/categories';

export interface TransactionSearchForm {
	readonly direction: SortDirection;
	readonly startDate: Date | null;
	readonly endDate: Date | null;
	readonly category: CategoryOption | null;
	readonly confirmed: YesNoFilter;
	readonly duplicate: YesNoFilter;
	readonly categorized: YesNoFilter;
	readonly possibleRefund: YesNoFilter;
	readonly description: string | null;
}

export const defaultStartDate = (): Date =>
	pipe(
		new Date(),
		Time.subMonths(1),
		Time.set({
			hours: 0,
			minutes: 0,
			seconds: 0,
			milliseconds: 0
		})
	);
export const defaultEndDate = (): Date =>
	pipe(
		new Date(),
		Time.set({
			hours: 0,
			minutes: 0,
			seconds: 0,
			milliseconds: 0
		})
	);

export const transactionSearchFormDefaultValues: TransactionSearchForm = {
	direction: SortDirection.DESC,
	startDate: defaultStartDate(),
	endDate: defaultEndDate(),
	category: null,
	duplicate: 'ALL',
	categorized: 'ALL',
	confirmed: 'ALL',
	possibleRefund: 'ALL',
	description: null
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
