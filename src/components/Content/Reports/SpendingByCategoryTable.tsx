import { Table } from '../../UI/Table';
import { ReportCategoryResponse } from '../../../types/generated/expense-tracker';
import { TableCell, TableRow } from '@mui/material';
import { formatCurrency, formatPercent } from '../../../utils/formatNumbers';
import { ColorBox } from '../../UI/ColorBox';

type Props = {
	readonly categories: ReadonlyArray<ReportCategoryResponse>;
};

const COLUMNS = ['', 'Category', 'Amount', 'Percent'];

// TODO need total
export const SpendingByCategoryTable = (props: Props) => (
	<Table columns={COLUMNS}>
		{props.categories.map((category) => (
			<TableRow key={category.name}>
				<TableCell>
					<ColorBox color={category.color} />
				</TableCell>
				<TableCell>{category.name}</TableCell>
				<TableCell>{formatCurrency(category.amount)}</TableCell>
				<TableCell>{formatPercent(category.percent)}</TableCell>
			</TableRow>
		))}
	</Table>
);
