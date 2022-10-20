import { SelectOption } from '@craigmiller160/react-hook-form-material-ui';
import { TablePaginationConfig } from '../../UI/Table';
import { Updater } from 'use-immer';
import { TransactionTableForm } from './useHandleTransactionTableData';
import {
	TransactionResponse,
	TransactionToUpdate
} from '../../../types/transactions';
import * as RArray from 'fp-ts/es6/ReadonlyArray';
import { identity, pipe } from 'fp-ts/es6/function';
import { CategoryResponse } from '../../../types/generated/expense-tracker';
import { SortDirection } from '../../../types/misc';
import * as Time from '@craigmiller160/ts-functions/es/Time';
import { useMemo } from 'react';
import { match, P } from 'ts-pattern';
import * as Option from 'fp-ts/es6/Option';

export type PaginationState = {
	readonly pageNumber: number;
	readonly pageSize: number;
};

export interface TransactionSearchForm {
	readonly direction: SortDirection;
	readonly startDate: Date;
	readonly endDate: Date;
	readonly category: SelectOption<string> | null;
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

export const useCategoriesToCategoryOptions = (
	categories: ReadonlyArray<CategoryResponse> | undefined
): CategoryOption[] =>
	useMemo(
		() => categories?.map(categoryToCategoryOption) ?? [],
		[categories]
	);

export const transactionToCategoryOption = (
	transaction: TransactionResponse
): CategoryOption | null =>
	match(transaction)
		.with(
			{ categoryId: P.not(P.nullish) },
			(t): CategoryOption => ({
				value: t.categoryId!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
				label: t.categoryName! // eslint-disable-line @typescript-eslint/no-non-null-assertion
			})
		)
		.otherwise(() => null);

export const formatAmountValue = (value: string): string => {
	if (value.length === 0) {
		return '';
	}
	const numericValue = value.replace(/[a-zA-z]/g, '');
	const parts = numericValue.split('.');
	const decimal = pipe(
		Option.fromNullable(parts[1]),
		Option.map((decimal) => decimal.padEnd(2, '0').substring(0, 2)),
		Option.fold(() => '00', identity)
	);
	return `${parts[0]}.${decimal}`;
};
