import { SelectOption } from '@craigmiller160/react-hook-form-material-ui';
import { TablePaginationConfig } from '../../UI/Table';
import { Updater } from 'use-immer';

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
