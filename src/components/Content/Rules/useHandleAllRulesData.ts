import { PaginationState } from '../../../utils/pagination';
import {
	useGetAllRules,
	useGetMaxOrdinal,
	useReOrderRule
} from '../../../ajaxapi/query/AutoCategorizeRuleQueries';
import {
	AutoCategorizeRuleResponse,
	CategoryResponse
} from '../../../types/generated/expense-tracker';
import { useGetAllCategories } from '../../../ajaxapi/query/CategoryQueries';
import { useMemo } from 'react';
import * as RArray from 'fp-ts/es6/ReadonlyArray';
import { pipe } from 'fp-ts/es6/function';
import * as Option from 'fp-ts/es6/Option';
import { useForm, UseFormReturn } from 'react-hook-form';
import { CategoryOption } from '../../../types/categories';
import { categoryToCategoryOption } from '../../../utils/categoryUtils';

type Props = PaginationState;

export type RulesFiltersFormData = {
	readonly category?: CategoryOption;
	readonly regex?: string;
};

type InternalReOrderActions = {
	readonly isLoading: boolean;
	readonly incrementRuleOrdinal: (rule: AutoCategorizeRuleResponse) => void;
	readonly decrementRuleOrdinal: (rule: AutoCategorizeRuleResponse) => void;
};
export type ReOrderActions = Omit<InternalReOrderActions, 'isLoading'>;

export type GetAllRulesDataResult = {
	readonly currentPage: number;
	readonly totalItems: number;
	readonly isFetching: boolean;
	readonly rules: ReadonlyArray<AutoCategorizeRuleResponse>;
	readonly categories: ReadonlyArray<CategoryOption>;
	readonly filtersForm: UseFormReturn<RulesFiltersFormData>;
	readonly maxOrdinal: number;
	readonly reOrder: ReOrderActions;
};

const useReOrderActions = (): InternalReOrderActions => {
	const { mutate, isLoading } = useReOrderRule();
	return {
		isLoading,
		incrementRuleOrdinal: (rule) =>
			mutate({
				ruleId: rule.id,
				ordinal: rule.ordinal + 1
			}),
		decrementRuleOrdinal: (rule) =>
			mutate({
				ruleId: rule.id,
				ordinal: rule.ordinal - 1
			})
	};
};

const formatCategories = (
	categories?: ReadonlyArray<CategoryResponse>
): ReadonlyArray<CategoryOption> =>
	pipe(
		Option.fromNullable(categories),
		Option.getOrElse((): ReadonlyArray<CategoryResponse> => []),
		RArray.map(categoryToCategoryOption)
	);

export const useHandleAllRulesData = (props: Props): GetAllRulesDataResult => {
	const form = useForm<RulesFiltersFormData>();
	const { data: getAllRulesData, isFetching: getAllRulesIsFetching } =
		useGetAllRules({
			pageNumber: props.pageNumber,
			pageSize: props.pageSize,
			categoryId: form.getValues().category?.value,
			regex: form.getValues().regex
		});
	const {
		data: getAllCategoriesData,
		isFetching: getAllCategoriesIsFetching
	} = useGetAllCategories();
	const { data: getMaxOrdinalData, isFetching: getMaxOrdinalIsFetching } =
		useGetMaxOrdinal();
	const {
		isLoading: reOrderIsLoading,
		incrementRuleOrdinal,
		decrementRuleOrdinal
	} = useReOrderActions();

	const categories = useMemo(
		() => formatCategories(getAllCategoriesData),
		[getAllCategoriesData]
	);

	return {
		reOrder: {
			incrementRuleOrdinal,
			decrementRuleOrdinal
		},
		currentPage: getAllRulesData?.pageNumber ?? 0,
		totalItems: getAllRulesData?.totalItems ?? 0,
		isFetching:
			getAllRulesIsFetching ||
			getAllCategoriesIsFetching ||
			getMaxOrdinalIsFetching ||
			reOrderIsLoading,
		rules: getAllRulesData?.rules ?? [],
		categories,
		filtersForm: form,
		maxOrdinal: getMaxOrdinalData?.maxOrdinal ?? 0
	};
};
