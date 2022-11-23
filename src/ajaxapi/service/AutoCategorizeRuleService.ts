import {
	AutoCategorizeRulePageRequest,
	AutoCategorizeRulePageResponse,
	AutoCategorizeRuleRequest,
	AutoCategorizeRuleResponse,
	MaxOrdinalResponse
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

export const getRule = (ruleId: string): Promise<AutoCategorizeRuleResponse> =>
	expenseTrackerApi
		.get<AutoCategorizeRuleResponse>({
			uri: `/categories/rules/${ruleId}`,
			errorCustomizer: 'Error getting rule'
		})
		.then(getData);

export const getMaxOrdinal = (): Promise<MaxOrdinalResponse> =>
	expenseTrackerApi
		.get<MaxOrdinalResponse>({
			uri: '/categories/rules/maxOrdinal',
			errorCustomizer: 'Error getting max ordinal'
		})
		.then(getData);

export const createRule = (
	request: AutoCategorizeRuleRequest
): Promise<AutoCategorizeRuleResponse> =>
	expenseTrackerApi
		.post<AutoCategorizeRuleResponse, AutoCategorizeRuleRequest>({
			uri: '/categories/rules',
			body: request,
			errorCustomizer: 'Error creating rule'
		})
		.then(getData);

export const updateRule = (
	ruleId: string,
	request: AutoCategorizeRuleRequest
): Promise<AutoCategorizeRuleResponse> =>
	expenseTrackerApi
		.put<AutoCategorizeRuleResponse, AutoCategorizeRuleRequest>({
			uri: `/categories/rules/${ruleId}`,
			body: request,
			errorCustomizer: 'Error updating rule'
		})
		.then(getData);

export const deleteRule = (ruleId: string): Promise<void> =>
	expenseTrackerApi
		.delete<void>({
			uri: `/categories/rules/${ruleId}`,
			errorCustomizer: 'Error deleting rule'
		})
		.then(getData);
