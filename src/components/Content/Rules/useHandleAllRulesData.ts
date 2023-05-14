import { PaginationState } from '../../../utils/pagination';
import {
	useGetAllRules,
	useGetMaxOrdinal,
	useReOrderRule
} from '../../../ajaxapi/query/AutoCategorizeRuleQueries';
import { AutoCategorizeRuleResponse } from '../../../types/generated/expense-tracker';
import { useGetAllCategories } from '../../../ajaxapi/query/CategoryQueries';
import { UseFormReturn } from 'react-hook-form';
import { CategoryOption } from '../../../types/categories';
import { useCategoriesToCategoryOptions } from '../../../utils/categoryUtils';
import { useFormWithSearchParamSync } from '../../../routes/useFormWithSearchParamSync';
import {
	SyncFromParams,
	SyncToParams
} from '../../../routes/useSearchParamSync';
import { setOrDeleteParam } from '../../../routes/paramUtils';

type Props = PaginationState;

export type RulesFiltersFormData = {
	readonly category: CategoryOption | null;
	readonly regex: string;
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

const formToParams: SyncToParams<RulesFiltersFormData> = (form, params) => {
	const setOrDelete = setOrDeleteParam(params);
	setOrDelete('category', form.category?.value);
	setOrDelete('regex', form.regex);
	return params;
};

const getCategoryFromParams = (
	params: URLSearchParams,
	categories: ReadonlyArray<CategoryOption>,
	categoryParam: string | null
): CategoryOption | null => {
	if (!categoryParam) {
		return null;
	}

	return categories.find((cat) => cat.value === categoryParam) ?? null;
};

const paramsToForm =
	(
		categories: ReadonlyArray<CategoryOption>
	): SyncFromParams<RulesFiltersFormData> =>
	(params) => ({
		category: getCategoryFromParams(
			params,
			categories,
			params.get('category')
		),
		regex: params.get('regex') ?? ''
	});

export const useHandleAllRulesData = (props: Props): GetAllRulesDataResult => {
	const {
		data: getAllCategoriesData,
		isFetching: getAllCategoriesIsFetching
	} = useGetAllCategories();
	const categories = useCategoriesToCategoryOptions(getAllCategoriesData);

	const form = useFormWithSearchParamSync<RulesFiltersFormData>({
		formToParams,
		formFromParams: paramsToForm(categories),
		formFromParamsDependencies: [categories],
		defaultValues: {
			regex: '',
			category: null
		}
	});
	const { data: getAllRulesData, isFetching: getAllRulesIsFetching } =
		useGetAllRules({
			pageNumber: props.pageNumber,
			pageSize: props.pageSize,
			categoryId: form.getValues().category?.value,
			regex: form.getValues().regex
		});
	const { data: getMaxOrdinalData, isFetching: getMaxOrdinalIsFetching } =
		useGetMaxOrdinal();
	const {
		isLoading: reOrderIsLoading,
		incrementRuleOrdinal,
		decrementRuleOrdinal
	} = useReOrderActions();

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
