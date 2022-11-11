import { useGetSpendingByMonthAndCategory } from '../../../ajaxapi/query/ReportQueries';
import { useImmer } from 'use-immer';
import { Table } from '../../UI/Table';

type State = {
	readonly pageNumber: number;
	readonly pageSize: number;
};

const COLUMNS = ['', ''];

export const ReportTable = () => {
	const [state, setState] = useImmer<State>({
		pageNumber: 0,
		pageSize: 10
	});
	useGetSpendingByMonthAndCategory(state.pageNumber, state.pageSize);

	return <Table columns={COLUMNS} />;
};
