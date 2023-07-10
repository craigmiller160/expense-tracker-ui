import { LastRuleAppliedResponse } from '../../types/generated/expense-tracker';
import { expenseTrackerApi, getData } from './AjaxApi';

export const getLastRuleApplied = (
	transactionId: string,
	signal?: AbortSignal
): Promise<LastRuleAppliedResponse> =>
	expenseTrackerApi
		.get<LastRuleAppliedResponse>({
			uri: `/transactions/rules/last-applied/${transactionId}`,
			errorCustomizer: 'Error getting last rule applied',
			config: {
				signal
			}
		})
		.then(getData);
