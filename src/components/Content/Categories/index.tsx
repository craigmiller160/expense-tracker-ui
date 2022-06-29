import { Typography } from '@mui/material';
import './Categories.scss';
import { useGetAllCategories } from '../../../ajaxapi/query/CategoryQueries';
import { CategoryResponse } from '../../../types/categories';
import { Table } from '../../UI/Table';

const COLUMNS = ['Name', 'Actions'];

export const Categories = () => {
	const { data } = useGetAllCategories();
	return (
		<div className="Categories">
			<Typography variant="h4">Manage Categories</Typography>
			<div className="TableWrapper">
				<Table columns={COLUMNS} />
			</div>
		</div>
	);
};
