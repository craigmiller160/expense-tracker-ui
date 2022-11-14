import { NeedsAttentionResponse } from '../../types/generated/expense-tracker';
import { expenseTrackerApi, getData } from './AjaxApi';

export const getNeedsAttention = (): Promise<NeedsAttentionResponse> =>
	expenseTrackerApi
		.get<NeedsAttentionResponse>({
			uri: '/needs-attention',
			errorCustomizer:
				'Error getting stats on transactions that need attention'
		})
		.then(getData);
