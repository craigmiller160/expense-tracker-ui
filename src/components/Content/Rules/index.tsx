import './Rules.scss';
import { PageResponsiveWrapper } from '../../UI/ResponsiveWrappers/PageResponsiveWrapper';
import { PageTitle } from '../../UI/PageTitle';
import { useImmer } from 'use-immer';
import { PaginationState } from '../../../utils/pagination';
import { RulesTable } from './RulesTable';
import { useGetAllRulesData } from './useGetAllRulesData';
import { RulesFilters } from './RulesFilters';

export const Rules = () => {
	const [state, setState] = useImmer<PaginationState>({
		pageNumber: 0,
		pageSize: 25
	});
	const {
		currentPage,
		totalItems,
		rules,
		isFetching,
		filtersForm,
		categories
	} = useGetAllRulesData(state);

	return (
		<PageResponsiveWrapper className="AutoCategorizeRules">
			<PageTitle title="Auto-Categorization Rules" />
			<RulesFilters form={filtersForm} categories={categories} />
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
