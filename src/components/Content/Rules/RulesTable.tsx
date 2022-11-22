import { useGetAllRules } from '../../../ajaxapi/query/AutoCategorizeRuleQueries';
import {
	createTablePagination,
	PaginationState
} from '../../../utils/pagination';
import { Updater } from 'use-immer';
import { Table } from '../../UI/Table';
import { TableCell, TableRow } from '@mui/material';
import './RulesTable.scss';

const COLUMNS = ['Ordinal', 'Category', 'Rule'];

type Props = {
	readonly pagination: PaginationState;
	readonly onPaginationChange: Updater<PaginationState>;
};

export const RulesTable = (props: Props) => {
	const { data, isFetching } = useGetAllRules({
		pageNumber: props.pagination.pageNumber,
		pageSize: props.pagination.pageSize
	});

	const paginationConfig = createTablePagination(
		data?.pageNumber ?? 0,
		props.pagination.pageSize,
		data?.totalItems ?? 0,
		props.onPaginationChange
	);
	// TODO I need the backend to return the category name
	return (
		<div className="AutoCategorizeRulesTable">
			<Table
				columns={COLUMNS}
				loading={isFetching}
				pagination={paginationConfig}
			>
				{data?.rules?.map((rule) => (
					<TableRow key={rule.id}>
						<TableCell>{rule.ordinal}</TableCell>
						<TableCell>{rule.categoryId}</TableCell>
						<TableCell>TBD</TableCell>
					</TableRow>
				))}
			</Table>
		</div>
	);
};
