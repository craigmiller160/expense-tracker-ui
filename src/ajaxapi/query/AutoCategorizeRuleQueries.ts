import {
	QueryClient,
	useMutation,
	UseMutationResult,
	useQuery,
	useQueryClient,
	UseQueryResult
} from 'react-query';
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
	updateRule
} from '../service/AutoCategorizeRuleService';
import { OptionT } from '@craigmiller160/ts-functions/es/types';
import * as Option from 'fp-ts/es6/Option';

export const GET_ALL_RULES = 'AutoCategorizeRuleQueries_GetAllRules';
export const GET_RULE = 'AutoCategorizeRuleQueries_GetRule';
export const GET_MAX_ORDINAL = 'AutoCategorizeRuleQueries_GetMaxOrdinal';

const invalidateRuleQueries = (queryClient: QueryClient): Promise<unknown> =>
	Promise.all([
		queryClient.invalidateQueries(GET_ALL_RULES),
		queryClient.invalidateQueries(GET_RULE),
		queryClient.invalidateQueries(GET_MAX_ORDINAL)
	]);

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

export const useGetMaxOrdinal = (): UseQueryResult<MaxOrdinalResponse, Error> =>
	useQuery<MaxOrdinalResponse, Error>(GET_MAX_ORDINAL, () => getMaxOrdinal());

type CreateRuleParams = {
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

type UpdateRuleParams = {
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

type DeleteRuleParams = {
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
