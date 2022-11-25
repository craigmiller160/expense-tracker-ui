import { useQuery, UseQueryResult } from 'react-query';
import { LastRuleAppliedResponse } from '../../types/generated/expense-tracker';
import { getLastRuleApplied } from '../service/LastAppliedRuleService';

export const GET_LAST_RULE_APPLIED =
	'LastRuleAppliedQueries_GetLastRuleApplied';

type GetLastRuleAppliedKey = [string, string];
export const useGetLastRuleApplied = (
	transactionId: string
): UseQueryResult<LastRuleAppliedResponse, Error> =>
	useQuery<
		LastRuleAppliedResponse,
		Error,
		LastRuleAppliedResponse,
		GetLastRuleAppliedKey
	>([GET_LAST_RULE_APPLIED, transactionId], ({ queryKey: [, id] }) =>
		getLastRuleApplied(id)
	);
