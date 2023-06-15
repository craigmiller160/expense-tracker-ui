import { Table } from '../../UI/Table';
import { ReportCategoryResponse } from '../../../types/generated/expense-tracker';
import { TableCell, TableRow } from '@mui/material';
import { formatCurrency, formatPercent } from '../../../utils/formatNumbers';
import { ColorBox } from '../../UI/ColorBox';
import * as RArray from 'fp-ts/es6/ReadonlyArray';
import { Ord } from 'fp-ts/es6/Ord';
import { match } from 'ts-pattern';
import { ReportCategoryOrderBy } from '../../../types/reports';
import { UseFormReturn } from 'react-hook-form';
import { ReportFilterFormData } from './useGetReportData';
import { useMemo } from 'react';

type Props = {
	readonly categories: ReadonlyArray<ReportCategoryResponse>;
	readonly total: number;
	readonly form: UseFormReturn<ReportFilterFormData>;
};

const COLUMNS = ['', 'Category', 'Amount', 'Percent'];
const sortByCategory: Ord<ReportCategoryResponse> = {
	equals: (a, b) => a.name === b.name,
	compare: (a, b) => {
		const result = a.name.localeCompare(b.name);
		if (result < 0) {
			return -1;
		} else if (result > 0) {
			return 1;
		}
		return 0;
	}
};
const sortByAmount: Ord<ReportCategoryResponse> = {
	equals: (a, b) => a.amount === b.amount,
	compare: (a, b) => {
		if (a.amount < b.amount) {
			return -1;
		} else if (a.amount > b.amount) {
			return 1;
		}
		return 0;
	}
};
export const sortCategories = (
	order: ReportCategoryOrderBy
): ((
	c: ReadonlyArray<ReportCategoryResponse>
) => ReadonlyArray<ReportCategoryResponse>) => {
	const sortBy = match(order)
		.with('CATEGORY', () => sortByCategory)
		.with('AMOUNT', () => sortByAmount)
		.run();
	return RArray.sort(sortBy);
};

export const SpendingByCategoryTable = (props: Props) => {
	const orderCategoriesBy = props.form.getValues().orderCategoriesBy;
	const categories = useMemo(
		() => sortCategories(orderCategoriesBy)(props.categories),
		[orderCategoriesBy, props.categories]
	);
	return (
		<Table columns={COLUMNS} className="SpendingByCategoryTable">
			{categories.map((category) => (
				<TableRow key={category.name}>
					<TableCell>
						<ColorBox color={category.color} />
					</TableCell>
					<TableCell>{category.name}</TableCell>
					<TableCell>{formatCurrency(category.amount)}</TableCell>
					<TableCell>{formatPercent(category.percent)}</TableCell>
				</TableRow>
			))}
			<TableRow>
				<TableCell />
				<TableCell>
					<strong>Total</strong>
				</TableCell>
				<TableCell>
					<strong>{formatCurrency(props.total)}</strong>
				</TableCell>
				<TableCell />
			</TableRow>
		</Table>
	);
};
