import { PageResponsiveWrapper } from '../../UI/ResponsiveWrappers/PageResponsiveWrapper';
import { PageTitle } from '../../UI/PageTitle';
import './Reports.scss';
import { ReportTable } from './ReportTable';
import { NeedsAttentionNotice } from '../Transactions/NeedsAttentionNotice';
import { useGetSpendingByMonthAndCategory } from '../../../ajaxapi/query/ReportQueries';
import { Updater, useImmer } from 'use-immer';
import { PaginationState } from '../../../utils/pagination';
import { ReportFilterFormData, ReportFilters } from './ReportFilters';
import { useForm, UseFormHandleSubmit } from 'react-hook-form';
import { ForceUpdate, useForceUpdate } from '../../../utils/useForceUpdate';

const createOnValueHasChanged = (
	handleSubmit: UseFormHandleSubmit<ReportFilterFormData>,
	setPaginationState: Updater<PaginationState>,
	forceUpdate: ForceUpdate
) =>
	handleSubmit(() =>
		setPaginationState((draft) => {
			if (draft.pageNumber === 0) {
				forceUpdate();
			} else {
				draft.pageNumber = 0;
			}
		})
	);

export const Reports = () => {
	const [state, setState] = useImmer<PaginationState>({
		pageNumber: 0,
		pageSize: 10
	});
	const form = useForm<ReportFilterFormData>();
	const { isFetching, data } = useGetSpendingByMonthAndCategory({
		pageNumber: state.pageNumber,
		pageSize: state.pageSize,
		excludeCategoryIds: form
			.getValues()
			.excludedCategories.map((cat) => cat.value)
	});
	const forceUpdate = useForceUpdate();
	const onValueHasChanged = createOnValueHasChanged(
		form.handleSubmit,
		setState,
		forceUpdate
	);
	return (
		<PageResponsiveWrapper className="Reports">
			<PageTitle title="Reports" />
			<ReportFilters form={form} onValueHasChanged={onValueHasChanged} />
			<NeedsAttentionNotice />
			<ReportTable
				isFetching={isFetching}
				data={data}
				pagination={state}
				updatePagination={setState}
			/>
		</PageResponsiveWrapper>
	);
};
