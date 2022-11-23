import { OptionT } from '@craigmiller160/ts-functions/es/types';
import { CategoryOption } from '../../../types/categories';
import { useGetAllCategories } from '../../../ajaxapi/query/CategoryQueries';
import {
	categoryToCategoryOption,
	itemWithCategoryToCategoryOption
} from '../../../utils/categoryUtils';
import {
	useGetMaxOrdinal,
	useGetRule
} from '../../../ajaxapi/query/AutoCategorizeRuleQueries';
import { AutoCategorizeRuleResponse } from '../../../types/generated/expense-tracker';
import { pipe } from 'fp-ts/es6/function';
import * as Option from 'fp-ts/es6/Option';
import { useForm, UseFormReturn } from 'react-hook-form';
import { useEffect } from 'react';
import {
	getTrueMaxOrdinal,
	useCreateOrdinalOptions
} from '../../../utils/ordinalUtils';
import { OrdinalOption } from '../../../types/rules';
import { parseServerDate } from '../../../utils/dateTimeUtils';

type Props = {
	readonly selectedRuleId: OptionT<string>;
	readonly open: boolean;
};

export type RuleFormData = {
	readonly category: CategoryOption | null;
	readonly ordinal: OrdinalOption | null;
	readonly regex: string | null;
	readonly startDate: Date | null;
	readonly endDate: Date | null;
	readonly minAmount: string | null;
	readonly maxAmount: string | null;
};

const createDefaultRuleValues = (ordinalValue: number): RuleFormData => ({
	category: null,
	ordinal: {
		value: ordinalValue,
		label: `${ordinalValue}`
	},
	regex: null,
	startDate: null,
	endDate: null,
	minAmount: null,
	maxAmount: null
});

type Data = {
	readonly categoryOptions: ReadonlyArray<CategoryOption>;
	readonly isFetching: boolean;
	readonly form: UseFormReturn<RuleFormData>;
	readonly ordinalOptions: ReadonlyArray<OrdinalOption>;
};

const parseRuleDate = (dateString?: string): Date | null =>
	pipe(
		Option.fromNullable(dateString),
		Option.map(parseServerDate),
		Option.getOrElse((): Date | null => null)
	);

const ruleToValues = (rule: AutoCategorizeRuleResponse): RuleFormData => ({
	ordinal: {
		value: rule.ordinal,
		label: `${rule.ordinal}`
	},
	category: itemWithCategoryToCategoryOption(rule),
	regex: rule.regex,
	startDate: parseRuleDate(rule.startDate),
	endDate: parseRuleDate(rule.endDate),
	minAmount: rule.minAmount?.toFixed(2) ?? null,
	maxAmount: rule.maxAmount?.toFixed(2) ?? null
});

const optionalRuleToValues = (
	trueMaxOrdinal: number,
	rule?: AutoCategorizeRuleResponse
): RuleFormData =>
	pipe(
		Option.fromNullable(rule),
		Option.fold(() => createDefaultRuleValues(trueMaxOrdinal), ruleToValues)
	);

export const useHandleRuleDialogData = (props: Props): Data => {
	const { data: allCategoriesData, isFetching: allCategoriesIsFetching } =
		useGetAllCategories();
	const { data: maxOrdinalData, isFetching: maxOrdinalIsFetching } =
		useGetMaxOrdinal();
	const { data: ruleData, isFetching: ruleIsFetching } = useGetRule(
		props.selectedRuleId
	);
	const form = useForm<RuleFormData>({
		mode: 'onChange',
		reValidateMode: 'onChange'
	});
	const { reset } = form;
	const trueMaxOrdinal = getTrueMaxOrdinal(
		maxOrdinalData?.maxOrdinal ?? 0,
		Option.isNone(props.selectedRuleId)
	);

	useEffect(() => {
		reset(optionalRuleToValues(trueMaxOrdinal, ruleData));
	}, [ruleData, reset, props.open, trueMaxOrdinal]);

	const ordinalOptions = useCreateOrdinalOptions(
		maxOrdinalData?.maxOrdinal ?? 0,
		Option.isNone(props.selectedRuleId)
	);

	return {
		categoryOptions: allCategoriesData?.map(categoryToCategoryOption) ?? [],
		isFetching:
			allCategoriesIsFetching || ruleIsFetching || maxOrdinalIsFetching,
		form,
		ordinalOptions
	};
};
