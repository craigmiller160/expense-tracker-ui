import {
	ReportPageResponse,
	ReportRequest
} from '../../types/generated/expense-tracker';
import { expenseTrackerApi, getData } from './AjaxApi';
import qs from 'qs';

export const getSpendingByMonthAndCategory = (
	request: ReportRequest
): Promise<ReportPageResponse> => {
	const query = qs.stringify(request, {
		arrayFormat: 'comma'
	});
	return expenseTrackerApi
		.get<ReportPageResponse>({
			uri: `/reports?${query}`,
			errorCustomizer: 'Error getting spending by month and category'
		})
		.then(getData);
};
