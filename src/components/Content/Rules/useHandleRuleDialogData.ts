import { OptionT } from '@craigmiller160/ts-functions/es/types';
import { CategoryOption } from '../../../types/categories';
import { useGetAllCategories } from '../../../ajaxapi/query/CategoryQueries';
import { categoryToCategoryOption } from '../../../utils/categoryUtils';
import { useGetRule } from '../../../ajaxapi/query/AutoCategorizeRuleQueries';
import { AutoCategorizeRuleResponse } from '../../../types/generated/expense-tracker';
import { pipe } from 'fp-ts/es6/function';
import * as Option from 'fp-ts/es6/Option';
import { useForm, UseFormReturn } from 'react-hook-form';
import { useEffect } from 'react';

type Props = {
	readonly selectedRuleId: OptionT<string>;
	readonly open: boolean;
};

export type RuleFormData = {
	readonly category: CategoryOption | null;
	readonly ordinal: number;
	readonly regex: string;
	readonly startDate: string | null;
	readonly endDate: string | null;
	readonly minAmount: number | null;
	readonly maxAmount: number | null;
};

const defaultRuleValues: RuleFormData = {
	category: null,
	ordinal: 1, // TODO bad
	regex: '',
	startDate: null,
	endDate: null,
	minAmount: null,
	maxAmount: null
};

type Data = {
	readonly categories: ReadonlyArray<CategoryOption>;
	readonly isFetching: boolean;
	readonly form: UseFormReturn<RuleFormData>;
};

const ruleToValues = (rule: AutoCategorizeRuleResponse): RuleFormData => ({
	ordinal: rule.ordinal,
	category: null,
	regex: rule.regex,
	startDate: rule.startDate ?? null,
	endDate: rule.endDate ?? null,
	minAmount: rule.minAmount ?? null,
	maxAmount: rule.maxAmount ?? null
});

const optionalRuleToValues = (
	rule?: AutoCategorizeRuleResponse
): RuleFormData =>
	pipe(
		Option.fromNullable(rule),
		Option.fold(() => defaultRuleValues, ruleToValues)
	);

export const useHandleRuleDialogData = (props: Props): Data => {
	const { data: allCategoriesData, isFetching: allCategoriesIsFetching } =
		useGetAllCategories();
	const { data: ruleData, isFetching: ruleIsFetching } = useGetRule(
		props.selectedRuleId
	);
	const form = useForm<RuleFormData>({
		mode: 'onChange',
		reValidateMode: 'onChange'
	});
	const { reset } = form;
	useEffect(() => {
		reset(optionalRuleToValues(ruleData));
	}, [ruleData, reset, props.open]);

	return {
		categories: allCategoriesData?.map(categoryToCategoryOption) ?? [],
		isFetching: allCategoriesIsFetching || ruleIsFetching,
		form
	};
};
