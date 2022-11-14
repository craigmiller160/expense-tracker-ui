import rawReports from '../../../fixtures/reports.json';
import { ReportPageResponse } from '../../../../src/types/generated/expense-tracker';

export const reports: ReportPageResponse = rawReports;
export const reportRootTableHeaders = ['Month', 'Data', 'Chart'];
