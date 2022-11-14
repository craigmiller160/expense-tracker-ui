import { useQuery, UseQueryResult } from 'react-query';
import { NeedsAttentionResponse } from '../../types/generated/expense-tracker';
import { getNeedsAttention } from '../service/TransactionService';

export const GET_NEEDS_ATTENTION = 'NeedsAttentionQueries_GetNeedsAttention';

export const useGetNeedsAttention = (): UseQueryResult<
	NeedsAttentionResponse,
	Error
> =>
	useQuery<NeedsAttentionResponse, Error>(GET_NEEDS_ATTENTION, () =>
		getNeedsAttention()
	);
