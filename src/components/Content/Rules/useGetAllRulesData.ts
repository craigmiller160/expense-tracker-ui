import { PaginationState } from '../../../utils/pagination';
import { useGetAllRules } from '../../../ajaxapi/query/AutoCategorizeRuleQueries';
import {
	AutoCategorizeRulePageResponse,
	AutoCategorizeRuleResponse
} from '../../../types/generated/expense-tracker';

type Props = PaginationState;

export type GetAllRulesDataResult = {
	readonly currentPage: number;
	readonly totalItems: number;
	readonly rules: ReadonlyArray<AutoCategorizeRuleResponse>;
};

export const useGetAllRulesData = (props: Props): GetAllRulesDataResult => {
	const { data: getAllRulesData, isFetching: getAllRulesIsFetching } =
		useGetAllRules({
			pageNumber: props.pageNumber,
			pageSize: props.pageSize
		});

	return {
		currentPage: getAllRulesData?.pageNumber ?? 0,
		totalItems: getAllRulesData?.totalItems ?? 0,
		rules: getAllRulesData?.rules ?? []
	};
};
