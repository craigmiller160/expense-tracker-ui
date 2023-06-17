import { Updater } from 'use-immer';
import { Table } from '../../UI/Table';
import { TableCell, TableRow, Link } from '@mui/material';
import { serverDateToReportMonth } from '../../../utils/dateTimeUtils';
import { SpendingByCategoryTable } from './SpendingByCategoryTable';
import { SpendingByCategoryChart } from './SpendingByCategoryChart';
import './ReportsTable.scss';
import {
	createTablePagination,
	PaginationState
} from '../../../utils/pagination';
import { ReportPageResponse } from '../../../types/generated/expense-tracker';
import { UseFormReturn } from 'react-hook-form';
import { ReportFilterFormData } from './useGetReportData';
import { getMonthLink } from './utils';

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
			className="ReportsTable"
			pagination={pagination}
			loading={props.isFetching}
			columns={COLUMNS}
			tableTitle="Spending by Month & Category"
		>
			{props.data?.reports?.map((report) => (
				<TableRow key={report.date}>
					<TableCell>
						<Link
							variant="body1"
							underline="none"
							color="secondary"
							href={getMonthLink(report.date)}
						>
							{serverDateToReportMonth(report.date)}
						</Link>
					</TableCell>
					<TableCell>
						<SpendingByCategoryTable
							categories={report.categories}
							total={report.total}
							form={props.form}
						/>
					</TableCell>
					<TableCell>
						<SpendingByCategoryChart
							categories={report.categories}
						/>
					</TableCell>
				</TableRow>
			))}
		</Table>
	);
};
