import {useGetSpendingByMonthAndCategory} from '../../../ajaxapi/query/ReportQueries';
import {useImmer} from 'use-immer';
import {Table} from '../../UI/Table';
import {TableCell, TableRow} from '@mui/material';
import {serverDateToReportMonth} from '../../../utils/dateTimeUtils';

type State = {
	readonly pageNumber: number;
	readonly pageSize: number;
};

const COLUMNS = ['Month', 'Data', 'Chart'];

export const ReportTable = () => {
	const [state, setState] = useImmer<State>({
		pageNumber: 0,
		pageSize: 10
	});
	const { isFetching, data } = useGetSpendingByMonthAndCategory(
		state.pageNumber,
		state.pageSize
	);

	return (
		<Table loading={isFetching} columns={COLUMNS}>
			{data?.reports?.map((report) => (
				<TableRow key={report.date}>
					<TableCell>
						{serverDateToReportMonth(report.date)}
					</TableCell>
					<TableCell></TableCell>
					<TableCell></TableCell>
				</TableRow>
			))}
		</Table>
	);
};
