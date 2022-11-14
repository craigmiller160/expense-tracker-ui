import { ReportPageResponse } from '../../types/generated/expense-tracker';
import { expenseTrackerApi, getData } from './AjaxApi';

export const getSpendingByMonthAndCategory = (
	pageNumber: number,
	pageSize: number
): Promise<ReportPageResponse> =>
	expenseTrackerApi
		.get<ReportPageResponse>({
			uri: `/reports?pageNumber=${pageNumber}&pageSize=${pageSize}`,
			errorCustomizer: 'Error getting spending by month and category'
		})
		.then(getData);
