import { OptionT } from '@craigmiller160/ts-functions/es/types';
import { CategoryOption } from '../../../types/categories';
import { useGetAllCategories } from '../../../ajaxapi/query/CategoryQueries';
import { categoryToCategoryOption } from '../../../utils/categoryUtils';
import { useGetRule } from '../../../ajaxapi/query/AutoCategorizeRuleQueries';
import { AutoCategorizeRuleResponse } from '../../../types/generated/expense-tracker';
import { pipe } from 'fp-ts/es6/function';
import * as Option from 'fp-ts/es6/Option';

type Props = {
	readonly selectedRuleId: OptionT<string>;
};

export type RuleValues = {
	readonly category?: CategoryOption;
	readonly ordinal: number;
	readonly regex: string;
	readonly startDate?: string;
	readonly endDate?: string;
	readonly minAmount?: number;
	readonly maxAmount?: number;
};

const defaultRuleValues: RuleValues = {
	ordinal: 1, // TODO bad
	regex: ''
};

type Data = {
	readonly categories: ReadonlyArray<CategoryOption>;
	readonly isFetching: boolean;
	readonly ruleValues: RuleValues;
};

const ruleToValues = (rule: AutoCategorizeRuleResponse): RuleValues => ({
	ordinal: rule.ordinal,
	category: undefined,
	regex: rule.regex,
	startDate: rule.startDate,
	endDate: rule.endDate,
	minAmount: rule.minAmount,
	maxAmount: rule.maxAmount
});

const optionalRuleToValues = (rule?: AutoCategorizeRuleResponse): RuleValues =>
	pipe(
		Option.fromNullable(rule),
		Option.fold(() => defaultRuleValues, ruleToValues)
	);

export const useHandleDialogData = (props: Props): Data => {
	const { data: allCategoriesData, isFetching: allCategoriesIsFetching } =
		useGetAllCategories();
	const { data: ruleData, isFetching: ruleIsFetching } = useGetRule(
		props.selectedRuleId
	);

	return {
		categories: allCategoriesData?.map(categoryToCategoryOption) ?? [],
		isFetching: allCategoriesIsFetching || ruleIsFetching,
		ruleValues: optionalRuleToValues(ruleData)
	};
};
