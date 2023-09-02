import { OptionT } from '@craigmiller160/ts-functions/types';
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
import { pipe } from 'fp-ts/function';
import * as Option from 'fp-ts/Option';
import { useForm, UseFormReturn } from 'react-hook-form';
import { useContext, useEffect } from 'react';
import {
	getTrueMaxOrdinal,
	useCreateOrdinalOptions
} from '../../../utils/ordinalUtils';
import { OrdinalOption } from '../../../types/rules';
import {
	formatServerDate,
	parseServerDate
} from '../../../utils/dateTimeUtils';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { ConfirmDialogContext } from '../../UI/ConfirmDialog/ConfirmDialogProvider';
import * as Task from 'fp-ts/Task';

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
	readonly clearSelectedRule: () => void;
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
		createRule: UseMutateAsyncFunction<
			AutoCategorizeRuleResponse,
			Error,
			CreateRuleParams
		>,
		updateRule: UseMutateAsyncFunction<
			AutoCategorizeRuleResponse,
			Error,
			UpdateRuleParams
		>,
		close: () => void
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
				() => () =>
					createRule({
						request
					}),
				(ruleId) => () =>
					updateRule({
						ruleId,
						request
					})
			),
			Task.map(close)
		)();
	};

const createDeleteRule =
	(
		selectedRuleId: OptionT<string>,
		deleteRule: UseMutateAsyncFunction<void, Error, DeleteRuleParams>,
		close: () => void,
		clearSelectedRule: () => void
	) =>
	() => {
		clearSelectedRule();
		pipe(
			selectedRuleId,
			Option.fold(
				() => () => Promise.resolve(),
				(ruleId) => () =>
					deleteRule({
						ruleId
					})
			),
			Task.map(close)
		)();
	};

export const useHandleRuleDialogData = (props: Props): Data => {
	const { newConfirmDialog } = useContext(ConfirmDialogContext);
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

	const { mutateAsync: createRuleMutate, isLoading: createRuleIsLoading } =
		useCreateRule();
	const { mutateAsync: updateRuleMutate, isLoading: updateRuleIsLoading } =
		useUpdateRule();
	const { mutateAsync: deleteRuleMutate, isLoading: deleteRuleIsLoading } =
		useDeleteRule();

	const saveRule = createSaveRule(
		props.selectedRuleId,
		createRuleMutate,
		updateRuleMutate,
		props.close
	);
	const deleteRule = createDeleteRule(
		props.selectedRuleId,
		deleteRuleMutate,
		props.close,
		props.clearSelectedRule
	);
	const confirmAndDeleteRule = () =>
		newConfirmDialog(
			'Delete Rule',
			'Are you sure you want to delete this rule?',
			deleteRule
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
		deleteRule: confirmAndDeleteRule
	};
};
