import type {
	AutoCategorizeRulePageResponse,
	AutoCategorizeRuleRequest,
	AutoCategorizeRuleResponse,
	MaxOrdinalResponse
} from '../../types/generated/expense-tracker';
import { stringify } from 'qs';
import { expenseTrackerApi, getData } from './AjaxApi';
import type { AutoCategorizeRulePageRequest } from '../../types/rules';

export const getAllRules = (
	request: AutoCategorizeRulePageRequest,
	signal?: AbortSignal
): Promise<AutoCategorizeRulePageResponse> => {
	const query = stringify(request);
	return expenseTrackerApi
		.get<AutoCategorizeRulePageResponse>({
			uri: `/categories/rules?${query}`,
			errorCustomizer: 'Error getting all rules',
			config: {
				signal
			}
		})
		.then(getData);
};

export const getRule = (
	ruleId: string,
	signal?: AbortSignal
): Promise<AutoCategorizeRuleResponse> =>
	expenseTrackerApi
		.get<AutoCategorizeRuleResponse>({
			uri: `/categories/rules/${ruleId}`,
			errorCustomizer: 'Error getting rule',
			config: {
				signal
			}
		})
		.then(getData);

export const getMaxOrdinal = (
	signal?: AbortSignal
): Promise<MaxOrdinalResponse> =>
	expenseTrackerApi
		.get<MaxOrdinalResponse>({
			uri: '/categories/rules/maxOrdinal',
			errorCustomizer: 'Error getting max ordinal',
			config: {
				signal
			}
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

export const reOrderRule = (ruleId: string, ordinal: number): Promise<void> =>
	expenseTrackerApi
		.put<void, void>({
			uri: `/categories/rules/${ruleId}/reOrder/${ordinal}`,
			errorCustomizer: 'Error re-ordering rule'
		})
		.then(getData);
