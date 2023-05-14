import {
	QueryClient,
	useMutation,
	UseMutationResult,
	useQuery,
	useQueryClient,
	UseQueryResult
} from '@tanstack/react-query';
import {
	AutoCategorizeRulePageRequest,
	AutoCategorizeRulePageResponse,
	AutoCategorizeRuleRequest,
	AutoCategorizeRuleResponse,
	MaxOrdinalResponse
} from '../../types/generated/expense-tracker';
import {
	createRule,
	deleteRule,
	getAllRules,
	getMaxOrdinal,
	getRule,
	reOrderRule,
	updateRule
} from '../service/AutoCategorizeRuleService';
import { OptionT } from '@craigmiller160/ts-functions/es/types';
import * as Option from 'fp-ts/es6/Option';
import { GET_LAST_RULE_APPLIED } from './LastAppliedRuleQueries';
import { debounceAsync } from '../../utils/debounceAsync';
import { QUERY_DEBOUNCE } from './constants';

export const GET_ALL_RULES = 'AutoCategorizeRuleQueries_GetAllRules';
export const GET_RULE = 'AutoCategorizeRuleQueries_GetRule';
export const GET_MAX_ORDINAL = 'AutoCategorizeRuleQueries_GetMaxOrdinal';

const invalidateRuleQueries = (queryClient: QueryClient): Promise<unknown> =>
	Promise.all([
		queryClient.invalidateQueries({ queryKey: [GET_ALL_RULES] }),
		queryClient.invalidateQueries({ queryKey: [GET_RULE] }),
		queryClient.invalidateQueries({ queryKey: [GET_MAX_ORDINAL] }),
		queryClient.invalidateQueries({ queryKey: [GET_LAST_RULE_APPLIED] })
	]);

type GetAllRulesKey = [string, AutoCategorizeRulePageRequest];
const debounceGetAllRules = debounceAsync(getAllRules, QUERY_DEBOUNCE);
export const useGetAllRules = (
	request: AutoCategorizeRulePageRequest
): UseQueryResult<AutoCategorizeRulePageResponse, Error> =>
	useQuery<
		AutoCategorizeRulePageResponse,
		Error,
		AutoCategorizeRulePageResponse,
		GetAllRulesKey
	>([GET_ALL_RULES, request], ({ queryKey: [, req] }) =>
		debounceGetAllRules(req)
	);

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

export const useGetMaxOrdinal = (): UseQueryResult<MaxOrdinalResponse, Error> =>
	useQuery<MaxOrdinalResponse, Error>({
		queryKey: [GET_MAX_ORDINAL],
		queryFn: getMaxOrdinal
	});

export type CreateRuleParams = {
	readonly request: AutoCategorizeRuleRequest;
};
export const useCreateRule = (): UseMutationResult<
	AutoCategorizeRuleResponse,
	Error,
	CreateRuleParams
> => {
	const queryClient = useQueryClient();
	return useMutation<AutoCategorizeRuleResponse, Error, CreateRuleParams>(
		({ request }) => createRule(request),
		{
			onSuccess: () => invalidateRuleQueries(queryClient)
		}
	);
};

export type UpdateRuleParams = {
	readonly ruleId: string;
	readonly request: AutoCategorizeRuleRequest;
};
export const useUpdateRule = (): UseMutationResult<
	AutoCategorizeRuleResponse,
	Error,
	UpdateRuleParams
> => {
	const queryClient = useQueryClient();
	return useMutation<AutoCategorizeRuleResponse, Error, UpdateRuleParams>(
		({ ruleId, request }) => updateRule(ruleId, request),
		{
			onSuccess: () => invalidateRuleQueries(queryClient)
		}
	);
};

export type DeleteRuleParams = {
	readonly ruleId: string;
};
export const useDeleteRule = (): UseMutationResult<
	void,
	Error,
	DeleteRuleParams
> => {
	const queryClient = useQueryClient();
	return useMutation<void, Error, DeleteRuleParams>(
		({ ruleId }) => deleteRule(ruleId),
		{
			onSuccess: () => invalidateRuleQueries(queryClient)
		}
	);
};

export type ReOrderRuleParams = {
	readonly ruleId: string;
	readonly ordinal: number;
};
export const useReOrderRule = (): UseMutationResult<
	void,
	Error,
	ReOrderRuleParams
> => {
	const queryClient = useQueryClient();
	return useMutation<void, Error, ReOrderRuleParams>(
		({ ruleId, ordinal }) => reOrderRule(ruleId, ordinal),
		{
			onSuccess: () => invalidateRuleQueries(queryClient)
		}
	);
};
