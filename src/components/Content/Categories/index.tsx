import { Button, TableCell, TableRow, Typography } from '@mui/material';
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
			<TableCell>
				<Button variant="contained" color="info">
					Edit
				</Button>
				<Button variant="contained" color="error">
					Delete
				</Button>
			</TableCell>
		</TableRow>
	));

export const Categories = () => {
	const { data, isLoading } = useGetAllCategories();
	const Rows = dataToRows(data);
	return (
		<div className="Categories">
			<div className="TitleWrapper">
				<Typography variant="h4">Manage Categories</Typography>
			</div>
			<div className="TableWrapper">
				<div className="ActionWrapper">
					<Button variant="contained" color="secondary">
						Add
					</Button>
				</div>
				<Table columns={COLUMNS} loading={isLoading}>
					{Rows}
				</Table>
			</div>
		</div>
	);
};
