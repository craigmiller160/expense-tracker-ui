import { SelectOption } from '@craigmiller160/react-hook-form-material-ui';
import { TablePaginationConfig } from '../../UI/Table';
import { Updater } from 'use-immer';
import { TransactionTableForm } from './useHandleTransactionTableData';
import { TransactionAndCategory } from '../../../types/transactions';
import * as RArray from 'fp-ts/es6/ReadonlyArray';
import { pipe } from 'fp-ts/es6/function';
import { CategoryResponse } from '../../../types/categories';

export interface PaginationState {
	readonly pageNumber: number;
	readonly pageSize: number;
}

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

export const formToCategorizeRequest = (
	values: TransactionTableForm
): ReadonlyArray<TransactionAndCategory> =>
	pipe(
		values.transactions,
		RArray.map(
			(txn): TransactionAndCategory => ({
				transactionId: txn.transactionId,
				categoryId: txn.category?.value ?? null
			})
		)
	);

export const categoryToCategoryOption = (
	category: CategoryResponse
): CategoryOption => ({
	label: category.name,
	value: category.id
});
