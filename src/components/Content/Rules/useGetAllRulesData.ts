import { PaginationState } from '../../../utils/pagination';
import { useGetAllRules } from '../../../ajaxapi/query/AutoCategorizeRuleQueries';
import {
	AutoCategorizeRulePageResponse,
	AutoCategorizeRuleResponse,
	CategoryResponse
} from '../../../types/generated/expense-tracker';
import { useGetAllCategories } from '../../../ajaxapi/query/CategoryQueries';
import {
	CategoryOption,
	categoryToCategoryOption
} from '../Transactions/utils';
import { useMemo } from 'react';
import * as RArray from 'fp-ts/es6/ReadonlyArray';
import { pipe } from 'fp-ts/es6/function';
import * as Option from 'fp-ts/es6/Option';

type Props = PaginationState;

export type GetAllRulesDataResult = {
	readonly currentPage: number;
	readonly totalItems: number;
	readonly rules: ReadonlyArray<AutoCategorizeRuleResponse>;
	readonly categories: ReadonlyArray<CategoryOption>;
};

const formatCategories = (
	categories?: ReadonlyArray<CategoryResponse>
): ReadonlyArray<CategoryOption> =>
	pipe(
		Option.fromNullable(categories),
		Option.getOrElse((): ReadonlyArray<CategoryResponse> => []),
		RArray.map(categoryToCategoryOption)
	);

export const useGetAllRulesData = (props: Props): GetAllRulesDataResult => {
	const { data: getAllRulesData, isFetching: getAllRulesIsFetching } =
		useGetAllRules({
			pageNumber: props.pageNumber,
			pageSize: props.pageSize
		});
	const {
		data: getAllCategoriesData,
		isFetching: getAllCategoriesIsFetching
	} = useGetAllCategories();

	const categories = useMemo(
		() => formatCategories(getAllCategoriesData),
		[getAllCategoriesData]
	);

	return {
		currentPage: getAllRulesData?.pageNumber ?? 0,
		totalItems: getAllRulesData?.totalItems ?? 0,
		rules: getAllRulesData?.rules ?? [],
		categories
	};
};
