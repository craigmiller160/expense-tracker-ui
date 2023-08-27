import { SelectOption } from '@craigmiller160/react-hook-form-material-ui';

export type ReportRequest = {
	readonly pageNumber: number;
	readonly pageSize: number;
	readonly categoryIdType: 'INCLUDE' | 'EXCLUDE';
	readonly categoryIds: ReadonlyArray<string>;
};

export type ReportCategoryIdFilterType = ReportRequest['categoryIdType'];

export type ReportCategoryIdFilterOption =
	SelectOption<ReportCategoryIdFilterType>;

export const REPORT_CATEGORY_FILTER_OPTIONS: ReadonlyArray<ReportCategoryIdFilterOption> =
	[
		{ label: 'Include', value: 'INCLUDE' },
		{ label: 'Exclude', value: 'EXCLUDE' }
	];

export type ReportCategoryOrderBy = 'CATEGORY' | 'AMOUNT';
export type ReportCategoryOrderByOption = SelectOption<ReportCategoryOrderBy>;
export const REPORT_CATEGORY_ORDER_BY_OPTIONS: ReadonlyArray<ReportCategoryOrderByOption> =
	[
		{ label: 'Category', value: 'CATEGORY' },
		{ label: 'Amount', value: 'AMOUNT' }
	];
