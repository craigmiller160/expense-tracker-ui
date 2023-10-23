import type { NeedsAttentionResponse } from '../../types/generated/expense-tracker';
import { expenseTrackerApi, getData } from './AjaxApi';

export const getNeedsAttention = (
	signal?: AbortSignal
): Promise<NeedsAttentionResponse> =>
	expenseTrackerApi
		.get<NeedsAttentionResponse>({
			uri: '/needs-attention',
			errorCustomizer:
				'Error getting stats on transactions that need attention',
			config: {
				signal
			}
		})
		.then(getData);
