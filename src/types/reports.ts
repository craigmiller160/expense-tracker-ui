import { ReportRequest } from './generated/expense-tracker';
import { SelectOption } from '@craigmiller160/react-hook-form-material-ui';

export type ReportCategoryIdFilterType = ReportRequest['categoryIdType'];

export type ReportCategoryIdFilterOption =
	SelectOption<ReportCategoryIdFilterType>;

export const REPORT_CATEGORY_FILTER_OPTIONS: ReadonlyArray<ReportCategoryIdFilterOption> =
	[
		{ label: 'Include', value: 'INCLUDE' },
		{ label: 'Exclude', value: 'EXCLUDE' }
	];

export type ReportOrderBy = 'CATEGORY' | 'AMOUNT';
export type ReportOrderByOption = SelectOption<ReportOrderBy>;
export const REPORT_ORDER_BY_OPTIONS: ReadonlyArray<ReportOrderByOption> = [
	{ label: 'Category', value: 'CATEGORY' },
	{ label: 'Amount', value: 'AMOUNT' }
];
