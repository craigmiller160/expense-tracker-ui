import { useQuery, UseQueryResult } from 'react-query';
import {
	AutoCategorizeRulePageRequest,
	AutoCategorizeRulePageResponse,
	AutoCategorizeRuleResponse
} from '../../types/generated/expense-tracker';
import { getAllRules, getRule } from '../service/AutoCategorizeRuleService';
import { OptionT } from '@craigmiller160/ts-functions/es/types';
import * as Option from 'fp-ts/es6/Option';

export const GET_ALL_RULES = 'AutoCategorizeRuleQueries_GetAllRules';
export const GET_RULE = 'AutoCategorizeRuleQueries_GetRule';

type GetAllRulesKey = [string, AutoCategorizeRulePageRequest];
export const useGetAllRules = (
	request: AutoCategorizeRulePageRequest
): UseQueryResult<AutoCategorizeRulePageResponse, Error> =>
	useQuery<
		AutoCategorizeRulePageResponse,
		Error,
		AutoCategorizeRulePageResponse,
		GetAllRulesKey
	>([GET_ALL_RULES, request], ({ queryKey: [, req] }) => getAllRules(req));

type GetRuleKey = [string, OptionT<string>];
export const useGetRule = (
	ruleId: OptionT<string>
): UseQueryResult<AutoCategorizeRuleResponse, Error> =>
	useQuery<
		AutoCategorizeRuleResponse,
		Error,
		AutoCategorizeRuleResponse,
		GetRuleKey
	>(
		[GET_RULE, ruleId],
		({ queryKey: [, id] }) =>
			// Will never execute orElse condition
			getRule(Option.getOrElse(() => '')(id)),
		{
			enabled: Option.isSome(ruleId)
		}
	);
