import './Rules.scss';
import { PageResponsiveWrapper } from '../../UI/ResponsiveWrappers/PageResponsiveWrapper';
import { PageTitle } from '../../UI/PageTitle';
import { Updater, useImmer } from 'use-immer';
import { PaginationState } from '../../../utils/pagination';
import { RulesTable } from './RulesTable';
import {
	RulesFiltersFormData,
	useHandleAllRulesData
} from './useHandleAllRulesData';
import { RulesFilters } from './RulesFilters';
import { UseFormHandleSubmit } from 'react-hook-form';
import { ForceUpdate, useForceUpdate } from '../../../utils/useForceUpdate';
import { useDebounce } from '../../../utils/useDebounce';
import { RuleDetailsDialog } from './RuleDetailsDialog';
import * as Option from 'fp-ts/es6/Option';
import { OptionT } from '@craigmiller160/ts-functions/es/types';
import {
	useCreateRule,
	useDeleteRule,
	useUpdateRule
} from '../../../ajaxapi/query/AutoCategorizeRuleQueries';
import { constVoid, pipe } from 'fp-ts/es6/function';
import { RuleFormData } from './useHandleRuleDialogData';
import { AutoCategorizeRuleRequest } from '../../../types/generated/expense-tracker';
import { formatServerDate } from '../../../utils/dateTimeUtils';

export const DEFAULT_ROWS_PER_PAGE = 25;

const useOnValueHasChanged = (
	handleSubmit: UseFormHandleSubmit<RulesFiltersFormData>,
	setPaginationState: Updater<PaginationState>,
	forceUpdate: ForceUpdate
) => {
	const submitFn = handleSubmit(() =>
		setPaginationState((draft) => {
			if (draft.pageNumber === 0) {
				forceUpdate();
			} else {
				draft.pageNumber = 0;
			}
		})
	);
	return useDebounce(submitFn, 300);
};

type DialogState = {
	readonly open: boolean;
	readonly selectedRuleId: OptionT<string>;
};

type DialogActions = {
	readonly openDialog: (ruleId?: string) => void;
	readonly closeDialog: () => void;
	readonly saveRule: (values: RuleFormData) => void;
	readonly deleteRule: () => void;
};

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

const useDialogActions = (
	setDialogState: Updater<DialogState>,
	selectedRuleId: OptionT<string>
): DialogActions => {
	const openDialog = (id?: string) =>
		setDialogState((draft) => {
			draft.open = true;
			draft.selectedRuleId = Option.fromNullable(id);
		});
	const closeDialog = () =>
		setDialogState((draft) => {
			draft.open = false;
		});

	const { mutate: createRuleMutate } = useCreateRule();
	const { mutate: updateRuleMutate } = useUpdateRule();
	const { mutate: deleteRuleMutate } = useDeleteRule();

	const saveRule = (values: RuleFormData) => {
		// Validations are enforced both in the form controls
		// and server-side, so the defaults won't be an issue
		const request: AutoCategorizeRuleRequest = {
			categoryId: values.category?.value ?? '',
			regex: values.regex ?? '',
			ordinal: values.ordinal ?? 1,
			startDate: parseRequestDate(values.startDate),
			endDate: parseRequestDate(values.endDate),
			minAmount: parseRequestAmount(values.minAmount),
			maxAmount: parseRequestAmount(values.maxAmount)
		};
		pipe(
			selectedRuleId,
			Option.fold(
				() =>
					createRuleMutate({
						request
					}),
				(ruleId) =>
					updateRuleMutate({
						ruleId,
						request
					})
			)
		);
	};

	const deleteRule = () =>
		pipe(
			selectedRuleId,
			Option.fold(constVoid, (ruleId) =>
				deleteRuleMutate({
					ruleId
				})
			)
		);

	return {
		openDialog,
		closeDialog,
		saveRule,
		deleteRule
	};
};

export const Rules = () => {
	const [paginationState, setPaginationState] = useImmer<PaginationState>({
		pageNumber: 0,
		pageSize: DEFAULT_ROWS_PER_PAGE
	});
	const [dialogState, setDialogState] = useImmer<DialogState>({
		open: false,
		selectedRuleId: Option.none
	});
	const {
		currentPage,
		totalItems,
		rules,
		isFetching,
		filtersForm,
		categories
	} = useHandleAllRulesData(paginationState);
	const forceUpdate = useForceUpdate();
	const onValueHasChanged = useOnValueHasChanged(
		filtersForm.handleSubmit,
		setPaginationState,
		forceUpdate
	);
	const { openDialog, closeDialog } = useDialogActions(
		setDialogState,
		dialogState.selectedRuleId
	);

	return (
		<PageResponsiveWrapper className="AutoCategorizeRules">
			<PageTitle title="Auto-Categorization Rules" />
			<RulesFilters
				form={filtersForm}
				categories={categories}
				onValueHasChanged={onValueHasChanged}
			/>
			<RulesTable
				currentPage={currentPage}
				totalItems={totalItems}
				rules={rules}
				isFetching={isFetching}
				pageSize={paginationState.pageSize}
				onPaginationChange={setPaginationState}
				openDialog={openDialog}
			/>
			<RuleDetailsDialog
				selectedRuleId={dialogState.selectedRuleId}
				open={dialogState.open}
				close={closeDialog}
			/>
		</PageResponsiveWrapper>
	);
};
