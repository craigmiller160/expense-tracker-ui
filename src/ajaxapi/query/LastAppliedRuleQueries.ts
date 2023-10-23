import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { LastRuleAppliedResponse } from '../../types/generated/expense-tracker';
import { getLastRuleApplied } from '../service/LastAppliedRuleService';
import { types } from '@craigmiller160/ts-functions';
import * as Option from 'fp-ts/Option';

export const GET_LAST_RULE_APPLIED =
	'LastRuleAppliedQueries_GetLastRuleApplied';

type GetLastRuleAppliedKey = [string, types.OptionT<string>];
export const useGetLastRuleApplied = (
	transactionId: types.OptionT<string>,
	isUnconfirmed: boolean
): UseQueryResult<LastRuleAppliedResponse, Error> =>
	useQuery<
		LastRuleAppliedResponse,
		Error,
		LastRuleAppliedResponse,
		GetLastRuleAppliedKey
	>({
		queryKey: [GET_LAST_RULE_APPLIED, transactionId],
		queryFn: ({ queryKey: [, id], signal }) =>
			// OrElse will never be used
			getLastRuleApplied(Option.getOrElse(() => '')(id), signal),
		enabled: Option.isSome(transactionId) && isUnconfirmed
	});
