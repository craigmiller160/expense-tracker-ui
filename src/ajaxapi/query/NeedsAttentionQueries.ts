import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { NeedsAttentionResponse } from '../../types/generated/expense-tracker';
import { getNeedsAttention } from '../service/NeedsAttentionService';

export const GET_NEEDS_ATTENTION = 'NeedsAttentionQueries_GetNeedsAttention';

export const useGetNeedsAttention = (): UseQueryResult<
	NeedsAttentionResponse,
	Error
> =>
	useQuery<NeedsAttentionResponse, Error>({
		queryKey: [GET_NEEDS_ATTENTION],
		queryFn: () => getNeedsAttention()
	});
