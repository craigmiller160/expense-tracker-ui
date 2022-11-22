import { useGetAllRules } from '../../../ajaxapi/query/AutoCategorizeRuleQueries';
import {
	createTablePagination,
	PaginationState
} from '../../../utils/pagination';
import { Updater } from 'use-immer';

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
	return <div />;
};
