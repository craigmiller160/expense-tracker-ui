import { ReportRequest } from './generated/expense-tracker';
import { SelectOption } from '@craigmiller160/react-hook-form-material-ui';

export type ReportCategoryIdFilterType = ReportRequest['categoryIdType'];

export type ReportCategoryIdFilterOption =
	SelectOption<ReportCategoryIdFilterType>;
