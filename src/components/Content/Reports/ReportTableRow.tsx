import type { ReportMonthResponse } from '../../../types/generated/expense-tracker';
import { TableCell, TableRow } from '@mui/material';
import { MuiRouterLink } from '../../UI/MuiRouterLink';
import { getMonthLink } from './utils';
import { serverDateToReportMonth } from '../../../utils/dateTimeUtils';
import { SpendingByCategoryTable } from './SpendingByCategoryTable';
import { SpendingByCategoryChart } from './SpendingByCategoryChart';
import type { UseFormReturn } from 'react-hook-form';
import type { ReportFilterFormData } from './useGetReportData';

type Props = Readonly<{
	currentMonthReport: ReportMonthResponse;
	form: UseFormReturn<ReportFilterFormData>;
	previousMonthReport?: ReportMonthResponse;
}>;

export const ReportTableRow = (props: Props) => {
	const { currentMonthReport, previousMonthReport } = props;
	return (
		<TableRow key={currentMonthReport.date}>
			<TableCell>
				<MuiRouterLink
					variant="body1"
					to={getMonthLink(currentMonthReport.date)}
				>
					{serverDateToReportMonth(currentMonthReport.date)}
				</MuiRouterLink>
			</TableCell>
			<TableCell>
				<SpendingByCategoryTable
					report={currentMonthReport}
					form={props.form}
				/>
			</TableCell>
			<TableCell>
				<SpendingByCategoryChart
					categories={currentMonthReport.categories}
				/>
			</TableCell>
		</TableRow>
	);
};
