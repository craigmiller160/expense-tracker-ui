import type { SelectOption } from '@craigmiller160/react-hook-form-material-ui';

export enum SortDirection {
	ASC = 'ASC',
	DESC = 'DESC'
}

export const isSortDirection = (
	value: string | null | undefined
): value is SortDirection =>
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	Object.values(SortDirection).includes(value);

export enum TransactionSortKey {
	EXPENSE_DATE = 'EXPENSE_DATE'
}

export type YesNoFilter = 'ALL' | 'YES' | 'NO';
export type YesNoFilterOption = SelectOption<YesNoFilter>;
export const YES_NO_FILTER_OPTIONS: ReadonlyArray<YesNoFilterOption> = [
	{ value: 'ALL', label: 'All' },
	{ value: 'YES', label: 'Yes' },
	{ value: 'NO', label: 'No' }
];
