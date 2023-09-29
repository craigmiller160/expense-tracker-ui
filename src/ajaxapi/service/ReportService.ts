import { ReportPageResponse } from '../../types/generated/expense-tracker';
import { expenseTrackerApi, getData } from './AjaxApi';
import { stringify } from 'qs';
import { ReportRequest } from '../../types/reports';

export const getSpendingByMonthAndCategory = (
	request: ReportRequest,
	signal?: AbortSignal
): Promise<ReportPageResponse> => {
	const query = stringify(request, {
		arrayFormat: 'comma'
	});
	return expenseTrackerApi
		.get<ReportPageResponse>({
			uri: `/reports?${query}`,
			errorCustomizer: 'Error getting spending by month and category',
			config: {
				signal
			}
		})
		.then(getData);
};
