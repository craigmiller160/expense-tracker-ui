import { OptionT, TaskT } from '@craigmiller160/ts-functions/es/types';
import { CategoryOption } from '../../../types/categories';
import { useGetAllCategories } from '../../../ajaxapi/query/CategoryQueries';
import {
	categoryToCategoryOption,
	itemWithCategoryToCategoryOption
} from '../../../utils/categoryUtils';
import {
	CreateRuleParams,
	DeleteRuleParams,
	UpdateRuleParams,
	useCreateRule,
	useDeleteRule,
	useGetMaxOrdinal,
	useGetRule,
	useUpdateRule
} from '../../../ajaxapi/query/AutoCategorizeRuleQueries';
import {
	AutoCategorizeRuleRequest,
	AutoCategorizeRuleResponse
} from '../../../types/generated/expense-tracker';
import { constVoid, pipe } from 'fp-ts/es6/function';
import * as Option from 'fp-ts/es6/Option';
import { useForm, UseFormReturn } from 'react-hook-form';
import { useEffect } from 'react';
import {
	getTrueMaxOrdinal,
	useCreateOrdinalOptions
} from '../../../utils/ordinalUtils';
import { OrdinalOption } from '../../../types/rules';
import {
	formatServerDate,
	parseServerDate
} from '../../../utils/dateTimeUtils';
import { UseMutateFunction } from 'react-query';
import * as Task from 'fp-ts/es6/Task';

const parseRequestDate = (date: Date | null): string | undefined =>
	pipe(
		Option.fromNullable(date),
		Option.fold((): string | undefined => undefined, formatServerDate)
	);
const parseRequestAmount = (amount: string | null): number | undefined =>
	pipe(
		Option.fromNullable(amount),
		Option.fold((): number | undefined => undefined, parseFloat)
	);

type Props = {
	readonly selectedRuleId: OptionT<string>;
	readonly open: boolean;
	readonly close: () => void;
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
	readonly saveRule: (values: RuleFormData) => void;
	readonly deleteRule: () => void;
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

const createSaveRule =
	(
		selectedRuleId: OptionT<string>,
		createRule: UseMutateFunction<
			AutoCategorizeRuleResponse,
			Error,
			CreateRuleParams
		>,
		updateRule: UseMutateFunction<
			AutoCategorizeRuleResponse,
			Error,
			UpdateRuleParams
		>,
		createWaitForSettled: TaskT<void>,
		updateWaitForSettled: TaskT<void>,
		onSettled: () => void
	) =>
	(values: RuleFormData): void => {
		// Validations are enforced both in the form controls
		// and server-side, so the defaults won't be an issue
		const request: AutoCategorizeRuleRequest = {
			categoryId: values.category?.value ?? '',
			regex: values.regex ?? '',
			ordinal: values.ordinal?.value ?? 1,
			startDate: parseRequestDate(values.startDate),
			endDate: parseRequestDate(values.endDate),
			minAmount: parseRequestAmount(values.minAmount),
			maxAmount: parseRequestAmount(values.maxAmount)
		};
		pipe(
			selectedRuleId,
			Option.fold(
				() => {
					createRule({
						request
					});
					return createWaitForSettled;
				},
				(ruleId) => {
					updateRule({
						ruleId,
						request
					});
					return updateWaitForSettled;
				}
			),
			Task.map(onSettled)
		)();
	};

const createDeleteRule =
	(
		selectedRuleId: OptionT<string>,
		deleteRule: UseMutateFunction<void, Error, DeleteRuleParams>,
		deleteWaitForSettled: TaskT<void>,
		onSettled: () => void
	) =>
	() =>
		pipe(
			selectedRuleId,
			Option.fold(
				() => () => Promise.resolve(constVoid()),
				(ruleId) => {
					deleteRule({
						ruleId
					});
					return deleteWaitForSettled;
				}
			),
			Task.map(onSettled)
		)();

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

	const {
		mutate: createRuleMutate,
		waitForSettled: createRuleWaitForSettled,
		isLoading: createRuleIsLoading
	} = useCreateRule();
	const {
		mutate: updateRuleMutate,
		waitForSettled: updateRuleWaitForSettled,
		isLoading: updateRuleIsLoading
	} = useUpdateRule();
	const {
		mutate: deleteRuleMutate,
		waitForSettled: deleteRuleWaitForSettled,
		isLoading: deleteRuleIsLoading
	} = useDeleteRule();

	const saveRule = createSaveRule(
		props.selectedRuleId,
		createRuleMutate,
		updateRuleMutate,
		createRuleWaitForSettled,
		updateRuleWaitForSettled,
		props.close
	);
	const deleteRule = createDeleteRule(
		props.selectedRuleId,
		deleteRuleMutate,
		deleteRuleWaitForSettled,
		props.close
	);

	return {
		categoryOptions: allCategoriesData?.map(categoryToCategoryOption) ?? [],
		isFetching:
			allCategoriesIsFetching ||
			ruleIsFetching ||
			maxOrdinalIsFetching ||
			createRuleIsLoading ||
			updateRuleIsLoading ||
			deleteRuleIsLoading,
		form,
		ordinalOptions,
		saveRule,
		deleteRule
	};
};
