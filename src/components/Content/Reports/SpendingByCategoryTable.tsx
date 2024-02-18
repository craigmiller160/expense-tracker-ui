import { Table } from '../../UI/Table';
import type {
	ReportCategoryResponse,
	ReportMonthResponse
} from '../../../types/generated/expense-tracker';
import { TableCell, TableRow } from '@mui/material';
import { formatCurrency, formatPercent } from '../../../utils/formatNumbers';
import { ColorBox } from '../../UI/ColorBox';
import * as RArray from 'fp-ts/ReadonlyArray';
import type { Ord } from 'fp-ts/Ord';
import { match } from 'ts-pattern';
import type { ReportCategoryOrderBy } from '../../../types/reports';
import type { UseFormReturn } from 'react-hook-form';
import type { ReportFilterFormData } from './useGetReportData';
import { useMemo } from 'react';
import { useGetUnknownCategory } from '../../../ajaxapi/query/CategoryQueries';
import { Spinner } from '../../UI/Spinner';
import { MuiRouterLink } from '../../UI/MuiRouterLink';
import { getMonthAndCategoryLink } from './utils';

type Props = Readonly<{
	currentMonthReport: ReportMonthResponse;
	form: UseFormReturn<ReportFilterFormData>;
	previousMonthReport?: ReportMonthResponse;
}>;

const COLUMNS = ['', 'Category', 'Amount', 'Change', 'Percent'];
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
		.with('AMOUNT', () => sortByAmount)
		.otherwise(() => sortByCategory);
	return RArray.sort(sortBy);
};

type ChangeCellContentProps = Readonly<{
	currentMonthAmount: number;
	previousMonthAmount?: number;
}>;

const ChangeCellContent = (props: ChangeCellContentProps) => {
	return <div />;
};

export const SpendingByCategoryTable = (props: Props) => {
	const orderCategoriesBy = props.form.getValues().orderCategoriesBy;
	const currentMonthCategories = useMemo(
		() =>
			sortCategories(orderCategoriesBy)(
				props.currentMonthReport.categories
			),
		[orderCategoriesBy, props.currentMonthReport.categories]
	);
	const { data: unknownCategory, isFetching: unknownCategoryIsFetching } =
		useGetUnknownCategory();

	if (unknownCategoryIsFetching) {
		return <Spinner />;
	}

	return (
		<Table columns={COLUMNS} className="SpendingByCategoryTable">
			{currentMonthCategories.map((currentMonthCategory) => {
				const previousMonthCategory =
					props.previousMonthReport?.categories.find(
						(prevCategory) =>
							prevCategory.name === currentMonthCategory.name
					);
				return (
					<TableRow key={currentMonthCategory.name}>
						<TableCell>
							<ColorBox color={currentMonthCategory.color} />
						</TableCell>
						<TableCell>
							<MuiRouterLink
								variant="body2"
								to={getMonthAndCategoryLink(
									props.currentMonthReport.date,
									currentMonthCategory.id,
									unknownCategory?.id ?? ''
								)}
							>
								{currentMonthCategory.name}
							</MuiRouterLink>
						</TableCell>
						<TableCell>
							{formatCurrency(currentMonthCategory.amount)}
						</TableCell>
						<TableCell>
							{props.previousMonthReport ? (
								<ChangeCellContent
									currentMonthAmount={
										currentMonthCategory.amount
									}
									previousMonthAmount={
										previousMonthCategory?.amount
									}
								/>
							) : (
								'N/A'
							)}
						</TableCell>
						<TableCell>
							{formatPercent(currentMonthCategory.percent)}
						</TableCell>
					</TableRow>
				);
			})}
			<TableRow>
				<TableCell />
				<TableCell>
					<strong>Total</strong>
				</TableCell>
				<TableCell>
					<strong>
						{formatCurrency(props.currentMonthReport.total)}
					</strong>
				</TableCell>
				<TableCell>
					<strong>N/A</strong>
				</TableCell>
				<TableCell />
			</TableRow>
		</Table>
	);
};
