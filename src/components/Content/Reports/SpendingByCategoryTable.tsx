import { Table } from '../../UI/Table';
import type { ReportCategoryResponse } from '../../../types/generated/expense-tracker';
import { TableCell, TableRow } from '@mui/material';
import { formatCurrency, formatPercent } from '../../../utils/formatNumbers';
import { ColorBox } from '../../UI/ColorBox';
import * as RArray from 'fp-ts/ReadonlyArray';
import type { Ord } from 'fp-ts/Ord';
import { match, P } from 'ts-pattern';
import type {
	ExtendedReportCategoryResponse,
	ExtendedReportMonthResponse,
	ReportCategoryOrderBy
} from '../../../types/reports';
import type { UseFormReturn } from 'react-hook-form';
import type { ReportFilterFormData } from './useGetReportData';
import { type ElementType, useMemo } from 'react';
import { useGetUnknownCategory } from '../../../ajaxapi/query/CategoryQueries';
import { Spinner } from '../../UI/Spinner';
import { MuiRouterLink } from '../../UI/MuiRouterLink';
import { getMonthAndCategoryLink } from './utils';
import './SpendingByCategoryTable.scss';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import classNames from 'classnames';

type Props = Readonly<{
	currentMonthReport: ExtendedReportMonthResponse;
	previousMonthReport?: ExtendedReportMonthResponse;
	form: UseFormReturn<ReportFilterFormData>;
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
	c: ReadonlyArray<ExtendedReportCategoryResponse>
) => ReadonlyArray<ExtendedReportCategoryResponse>) => {
	const sortBy = match(order)
		.with('AMOUNT', () => sortByAmount)
		.otherwise(() => sortByCategory);
	return RArray.sort(sortBy);
};

type ChangeCellContentProps = Readonly<{
	change?: number;
	isBold?: boolean;
}>;

type ClassAndIcon = Readonly<{
	className: string;
	Icon?: ElementType;
}>;

const ChangeCellContent = (props: ChangeCellContentProps) => {
	const { className, Icon } = match<number | undefined, ClassAndIcon>(
		props.change
	)
		.with(P.nullish, () => ({
			className: 'equal-to'
		}))
		.with(P.number.gt(0), () => ({
			className: 'greater-than',
			Icon: ArrowDropDownIcon
		}))
		.with(P.number.lt(0), () => ({
			className: 'less-than',
			Icon: ArrowDropUpIcon
		}))
		.otherwise(() => ({
			className: 'equal-to'
		}));
	const fullClassName = classNames('change-cell-content', className);
	return (
		<div className={fullClassName}>
			<span>{props.change ? formatCurrency(props.change) : 'N/A'} </span>
			<span>{Icon ? <Icon /> : undefined}</span>
		</div>
	);
};

export const SpendingByCategoryTable = (props: Props) => {
	const orderCategoriesBy = props.form.getValues().orderCategoriesBy;
	const categories = useMemo(
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
		<Table columns={COLUMNS} className="spending-by-category-table">
			{categories.map((category) => (
				<TableRow key={category.name}>
					<TableCell>
						<ColorBox color={category.color} />
					</TableCell>
					<TableCell>
						<MuiRouterLink
							variant="body2"
							to={getMonthAndCategoryLink(
								props.currentMonthReport.date,
								category.id,
								unknownCategory?.id ?? ''
							)}
						>
							{category.name}
						</MuiRouterLink>
					</TableCell>
					<TableCell>{formatCurrency(category.amount)}</TableCell>
					<TableCell>
						<ChangeCellContent change={category.amountChange} />
					</TableCell>
					<TableCell>{formatPercent(category.percent)}</TableCell>
				</TableRow>
			))}
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
					<ChangeCellContent
						change={props.currentMonthReport.totalChange}
						isBold
					/>
				</TableCell>
				<TableCell />
			</TableRow>
		</Table>
	);
};
