import { PageResponsiveWrapper } from '../../UI/ResponsiveWrappers/PageResponsiveWrapper';
import { PageTitle } from '../../UI/PageTitle';
import './Reports.scss';
import {ReportTable} from './ReportTable';
import {Typography} from '@mui/material';

export const Reports = () => (
	<PageResponsiveWrapper className="Reports">
		<PageTitle title="Reports" />
		<Typography variant="h6">Spending by Month & Category</Typography>
		<ReportTable />
	</PageResponsiveWrapper>
);
