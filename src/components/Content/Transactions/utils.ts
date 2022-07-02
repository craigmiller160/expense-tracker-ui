import { SelectOption } from '@craigmiller160/react-hook-form-material-ui';

export interface PaginationState {
	readonly pageNumber: number;
	readonly pageSize: number;
}

export type CategoryOption = SelectOption<string>;
export const DEFAULT_ROWS_PER_PAGE = 25;
