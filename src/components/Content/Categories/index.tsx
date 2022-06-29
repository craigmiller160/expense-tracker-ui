import { TableCell, TableRow, Typography } from '@mui/material';
import './Categories.scss';
import { useGetAllCategories } from '../../../ajaxapi/query/CategoryQueries';
import { Table } from '../../UI/Table';

const COLUMNS = ['Name', 'Actions'];

export const Categories = () => {
	const { data } = useGetAllCategories();
	return (
		<div className="Categories">
			<Typography variant="h4">Manage Categories</Typography>
			<div className="TableWrapper">
				<Table columns={COLUMNS}>
					{(data ?? []).map((category) => (
						<TableRow key={category.id}>
							<TableCell>{category.name}</TableCell>
							<TableCell>TBD</TableCell>
						</TableRow>
					))}
				</Table>
			</div>
		</div>
	);
};
