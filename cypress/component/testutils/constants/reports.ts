import rawReports from '../../../fixtures/reports.json';
import { ReportPageResponse } from '../../../../src/types/generated/expense-tracker';
import { REPORT_CATEGORY_ORDER_BY_OPTIONS } from '../../../../src/types/reports';

export const reports: ReportPageResponse = rawReports;
export const reportRootTableHeaders = ['Month', 'Data', 'Chart'];

export const orderCategoriesByNames = REPORT_CATEGORY_ORDER_BY_OPTIONS.map(
	(_) => _.label
);
