import { SelectOption } from '@craigmiller160/react-hook-form-material-ui';
import { TablePaginationConfig } from '../../UI/Table';
import { Updater } from 'use-immer';
import { TransactionTableForm } from './useHandleTransactionTableData';
import { TransactionToUpdate } from '../../../types/transactions';
import * as RArray from 'fp-ts/es6/ReadonlyArray';
import { pipe } from 'fp-ts/es6/function';
import { CategoryResponse } from '../../../types/categories';
import { SortDirection } from '../../../types/misc';
import * as Time from '@craigmiller160/ts-functions/es/Time';

export interface PaginationState {
	readonly pageNumber: number;
	readonly pageSize: number;
}

export interface TransactionSearchForm {
	readonly direction: SortDirection;
	readonly startDate: Date;
	readonly endDate: Date;
	readonly category: SelectOption<string> | null;
	readonly isNotConfirmed: boolean;
	readonly isDuplicate: boolean;
	readonly isNotCategorized: boolean;
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
	isNotConfirmed: false
};

export type CategoryOption = SelectOption<string>;
export const DEFAULT_ROWS_PER_PAGE = 25;

export const createTablePagination = (
	currentPage: number,
	pageSize: number,
	totalRecords: number,
	updatePagination: Updater<PaginationState>
): TablePaginationConfig => ({
	totalRecords,
	recordsPerPage: pageSize,
	currentPage,
	onChangePage: (_, pageNumber) =>
		updatePagination((draft) => {
			draft.pageNumber = pageNumber;
		}),
	onRecordsPerPageChange: (event) =>
		updatePagination((draft) => {
			draft.pageSize = parseInt(event.target.value, 10);
		})
});

export const formToUpdateRequest = (
	values: TransactionTableForm
): ReadonlyArray<TransactionToUpdate> =>
	pipe(
		values.transactions,
		RArray.map(
			(txn): TransactionToUpdate => ({
				transactionId: txn.transactionId,
				categoryId: txn.category?.value ?? null,
				confirmed: txn.confirmed
			})
		)
	);

export const categoryToCategoryOption = (
	category: CategoryResponse
): CategoryOption => ({
	label: category.name,
	value: category.id
});
