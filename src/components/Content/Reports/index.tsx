import { PageResponsiveWrapper } from '../../UI/ResponsiveWrappers/PageResponsiveWrapper';
import { PageTitle } from '../../UI/PageTitle';
import './Reports.scss';
import { ReportTable } from './ReportTable';
import { NeedsAttentionNotice } from '../Transactions/NeedsAttentionNotice';
import { useGetSpendingByMonthAndCategory } from '../../../ajaxapi/query/ReportQueries';
import { useImmer } from 'use-immer';
import { PaginationState } from '../../../utils/pagination';
import { ReportFilterFormData, ReportFilters } from './ReportFilters';
import { useForm } from 'react-hook-form';

export const Reports = () => {
	const [state, setState] = useImmer<PaginationState>({
		pageNumber: 0,
		pageSize: 10
	});
	const { isFetching, data } = useGetSpendingByMonthAndCategory({
		pageNumber: state.pageNumber,
		pageSize: state.pageSize,
		excludeCategoryIds: []
	});
	const form = useForm<ReportFilterFormData>();
	return (
		<PageResponsiveWrapper className="Reports">
			<PageTitle title="Reports" />
			<ReportFilters form={form} onValueHasChanged={() => null} />
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
