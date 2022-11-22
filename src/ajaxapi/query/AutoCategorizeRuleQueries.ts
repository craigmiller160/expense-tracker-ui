import { useQuery, UseQueryResult } from 'react-query';
import {
	AutoCategorizeRulePageRequest,
	AutoCategorizeRulePageResponse
} from '../../types/generated/expense-tracker';
import { getAllRules } from '../service/AutoCategorizeRuleService';

export const GET_ALL_RULES = 'AutoCategorizeRuleQueries_GetAllRules';

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
