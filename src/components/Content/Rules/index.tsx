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

export const Rules = () => {
	const [state, setState] = useImmer<PaginationState>({
		pageNumber: 0,
		pageSize: DEFAULT_ROWS_PER_PAGE
	});
	const {
		currentPage,
		totalItems,
		rules,
		isFetching,
		filtersForm,
		categories
	} = useHandleAllRulesData(state);
	const forceUpdate = useForceUpdate();
	const onValueHasChanged = useOnValueHasChanged(
		filtersForm.handleSubmit,
		setState,
		forceUpdate
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
				pageSize={state.pageSize}
				onPaginationChange={setState}
			/>
		</PageResponsiveWrapper>
	);
};
