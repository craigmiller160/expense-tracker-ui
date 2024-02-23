import type { Updater } from 'use-immer';
import { Table } from '../../UI/Table';
import { TableCell, TableRow } from '@mui/material';
import { serverDateToReportMonth } from '../../../utils/dateTimeUtils';
import { SpendingByCategoryTable } from './SpendingByCategoryTable';
import { SpendingByCategoryChart } from './SpendingByCategoryChart';
import './ReportsTable.scss';
import type { PaginationState } from '../../../utils/pagination';
import { createTablePagination } from '../../../utils/pagination';
import type { ReportPageResponse } from '../../../types/generated/expense-tracker';
import type { UseFormReturn } from 'react-hook-form';
import type { ReportFilterFormData } from './useGetReportData';
import { getMonthLink } from './utils';
import { MuiRouterLink } from '../../UI/MuiRouterLink';

const COLUMNS = ['Month', 'Data', 'Chart'];

type Props = {
	readonly isFetching: boolean;
	readonly data?: ReportPageResponse;
	readonly pagination: PaginationState;
	readonly updatePagination: Updater<PaginationState>;
	readonly form: UseFormReturn<ReportFilterFormData>;
};

export const ReportTable = (props: Props) => {
	const pagination = createTablePagination(
		props.pagination.pageNumber,
		props.pagination.pageSize,
		props.data?.totalItems ?? 0,
		props.updatePagination
	);

	return (
		<Table
			className="reports-table"
			pagination={pagination}
			loading={props.isFetching}
			columns={COLUMNS}
			tableTitle="Spending by Month & Category"
		>
			{props.data?.reports?.map((report, index, array) => {
				const previousMonthReport = array[index + 1];
				return (
					<TableRow key={report.date}>
						<TableCell>
							<MuiRouterLink
								variant="body1"
								to={getMonthLink(report.date)}
							>
								{serverDateToReportMonth(report.date)}
							</MuiRouterLink>
						</TableCell>
						<TableCell>
							<SpendingByCategoryTable
								currentMonthReport={report}
								previousMonthReport={previousMonthReport}
								form={props.form}
							/>
						</TableCell>
						<TableCell>
							<SpendingByCategoryChart
								categories={report.categories}
							/>
						</TableCell>
					</TableRow>
				);
			})}
		</Table>
	);
};
