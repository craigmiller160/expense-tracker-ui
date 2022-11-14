import { PageResponsiveWrapper } from '../../UI/ResponsiveWrappers/PageResponsiveWrapper';
import { PageTitle } from '../../UI/PageTitle';
import './Reports.scss';
import { ReportTable } from './ReportTable';
import { NeedsAttentionNotice } from '../Transactions/NeedsAttentionNotice';

export const Reports = () => (
	<PageResponsiveWrapper className="Reports">
		<PageTitle title="Reports" />
		<NeedsAttentionNotice />
		<ReportTable />
	</PageResponsiveWrapper>
);
