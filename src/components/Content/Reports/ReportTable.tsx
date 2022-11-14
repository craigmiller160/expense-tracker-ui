import { useGetSpendingByMonthAndCategory } from '../../../ajaxapi/query/ReportQueries';
import { useImmer } from 'use-immer';
import { Table } from '../../UI/Table';
import { TableCell, TableRow } from '@mui/material';
import { serverDateToReportMonth } from '../../../utils/dateTimeUtils';
import { createTablePagination, PaginationState } from '../Transactions/utils';
import { SpendingByCategoryTable } from './SpendingByCategoryTable';
import { SpendingByCategoryChart } from './SpendingByCategoryChart';
import './ReportsTable.scss';

const COLUMNS = ['Month', 'Data', 'Chart'];

export const ReportTable = () => {
	const [state, setState] = useImmer<PaginationState>({
		pageNumber: 0,
		pageSize: 10
	});
	const { isFetching, data } = useGetSpendingByMonthAndCategory(
		state.pageNumber,
		state.pageSize
	);

	const pagination = createTablePagination(
		state.pageNumber,
		state.pageSize,
		data?.totalItems ?? 0,
		setState
	);

	return (
		<Table
			id="ReportsTable"
			pagination={pagination}
			loading={isFetching}
			columns={COLUMNS}
		>
			{data?.reports?.map((report) => (
				<TableRow key={report.date}>
					<TableCell>
						{serverDateToReportMonth(report.date)}
					</TableCell>
					<TableCell>
						<SpendingByCategoryTable
							categories={report.categories}
							total={report.total}
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
