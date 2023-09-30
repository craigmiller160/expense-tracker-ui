import { PageResponsiveWrapper } from '../../UI/ResponsiveWrappers/PageResponsiveWrapper';
import { PageTitle } from '../../UI/PageTitle';
import './Reports.scss';
import { ReportTable } from './ReportTable';
import { NeedsAttentionNotice } from '../Transactions/NeedsAttentionNotice';
import { ReportFilters } from './ReportFilters';
import { useGetReportData } from './useGetReportData';

export const Reports = () => {
	const {
		form,
		data: { isFetching, report, categories },
		pagination: { state, setState },
		onValueHasChanged
	} = useGetReportData();
	return (
		<PageResponsiveWrapper className="reports">
			<PageTitle title="Reports" />
			{!isFetching && (
				<ReportFilters
					form={form}
					categories={categories}
					onValueHasChanged={onValueHasChanged}
				/>
			)}
			<NeedsAttentionNotice />
			<ReportTable
				isFetching={isFetching}
				data={report}
				pagination={state}
				updatePagination={setState}
				form={form}
			/>
		</PageResponsiveWrapper>
	);
};
