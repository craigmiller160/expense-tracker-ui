import {
	QueryClient,
	useMutation,
	UseMutationResult,
	useQuery,
	useQueryClient,
	UseQueryResult
} from '@tanstack/react-query';
import {
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
import { types } from '@craigmiller160/ts-functions';
import * as Option from 'fp-ts/Option';
import { GET_LAST_RULE_APPLIED } from './LastAppliedRuleQueries';
import { debounceAsync } from '../../utils/debounceAsync';
import { QUERY_DEBOUNCE } from './constants';
import { AutoCategorizeRulePageRequest } from '../../types/rules';

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
	>({
		queryKey: [GET_ALL_RULES, request],
		queryFn: ({ queryKey: [, req], signal }) =>
			debounceGetAllRules(req, signal)
	});

type GetRuleKey = [string, types.OptionT<string>];
export const useGetRule = (
	ruleId: types.OptionT<string>
): UseQueryResult<AutoCategorizeRuleResponse, Error> =>
	useQuery<
		AutoCategorizeRuleResponse,
		Error,
		AutoCategorizeRuleResponse,
		GetRuleKey
	>({
		queryKey: [GET_RULE, ruleId],
		queryFn: ({ queryKey: [, id], signal }) =>
			// Will never execute orElse condition
			getRule(Option.getOrElse(() => '')(id), signal),
		enabled: Option.isSome(ruleId)
	});

export const useGetMaxOrdinal = (): UseQueryResult<MaxOrdinalResponse, Error> =>
	useQuery<MaxOrdinalResponse, Error>({
		queryKey: [GET_MAX_ORDINAL],
		queryFn: ({ signal }) => getMaxOrdinal(signal)
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
	return useMutation<AutoCategorizeRuleResponse, Error, CreateRuleParams>({
		mutationFn: ({ request }) => createRule(request),
		onSuccess: () => invalidateRuleQueries(queryClient)
	});
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
	return useMutation<AutoCategorizeRuleResponse, Error, UpdateRuleParams>({
		mutationFn: ({ ruleId, request }) => updateRule(ruleId, request),
		onSuccess: () => invalidateRuleQueries(queryClient)
	});
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
	return useMutation<void, Error, DeleteRuleParams>({
		mutationFn: ({ ruleId }) => deleteRule(ruleId),
		onSuccess: () => invalidateRuleQueries(queryClient)
	});
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
	return useMutation<void, Error, ReOrderRuleParams>({
		mutationFn: ({ ruleId, ordinal }) => reOrderRule(ruleId, ordinal),
		onSuccess: () => invalidateRuleQueries(queryClient)
	});
};
