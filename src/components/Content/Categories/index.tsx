import { TableCell, TableRow, Typography } from '@mui/material';
import './Categories.scss';
import { useGetAllCategories } from '../../../ajaxapi/query/CategoryQueries';
import { Table } from '../../UI/Table';
import { CategoryResponse } from '../../../types/categories';
import { ReactNode } from 'react';

const COLUMNS = ['Name', 'Actions'];

const dataToRows = (
	data?: ReadonlyArray<CategoryResponse>
): ReadonlyArray<ReactNode> =>
	(data ?? []).map((category) => (
		<TableRow key={category.id}>
			<TableCell>{category.name}</TableCell>
			<TableCell>TBD</TableCell>
		</TableRow>
	));

export const Categories = () => {
	const { data, isLoading } = useGetAllCategories();
	const Rows = dataToRows(data);
	return (
		<div className="Categories">
			<Typography variant="h4">Manage Categories</Typography>
			<div className="TableWrapper">
				<Table columns={COLUMNS} loading={true}>
					{Rows}
				</Table>
			</div>
		</div>
	);
};
