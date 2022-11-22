import {
	AutoCategorizeRulePageRequest,
	AutoCategorizeRulePageResponse
} from '../../types/generated/expense-tracker';
import qs from 'qs';
import { expenseTrackerApi, getData } from './AjaxApi';

export const getAllRules = (
	request: AutoCategorizeRulePageRequest
): Promise<AutoCategorizeRulePageResponse> => {
	const query = qs.stringify(request);
	return expenseTrackerApi
		.get<AutoCategorizeRulePageResponse>({
			uri: `/categories/rules?${query}`,
			errorCustomizer: 'Error getting all rules'
		})
		.then(getData);
};
