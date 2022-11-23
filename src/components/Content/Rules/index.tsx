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
};

const useDialogActions = (
	setDialogState: Updater<DialogState>
): DialogActions => {
	const openDialog = (id?: string) =>
		setDialogState((draft) => {
			draft.open = true;
			draft.selectedRuleId = Option.fromNullable(id);
		});
	const closeDialog = () =>
		setDialogState((draft) => {
			draft.open = false;
			draft.selectedRuleId = Option.none;
		});

	return {
		openDialog,
		closeDialog
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
	const { openDialog, closeDialog } = useDialogActions(setDialogState);

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
