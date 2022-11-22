import {
	createTablePagination,
	PaginationState
} from '../../../utils/pagination';
import { Updater } from 'use-immer';
import { Table } from '../../UI/Table';
import { TableCell, TableRow } from '@mui/material';
import './RulesTable.scss';
import { AutoCategorizeRuleResponse } from '../../../types/generated/expense-tracker';
import { pipe } from 'fp-ts/es6/function';
import * as Option from 'fp-ts/es6/Option';
import { serverDateToDisplayDate } from '../../../utils/dateTimeUtils';
import { formatCurrency } from '../../../utils/formatNumbers';
import { useGetAllRulesData } from './useGetAllRulesData';

const COLUMNS = ['Ordinal', 'Category', 'Rule'];

type Props = {
	readonly pagination: PaginationState;
	readonly onPaginationChange: Updater<PaginationState>;
};

type RuleProps = {
	readonly rule: AutoCategorizeRuleResponse;
};

const formatDate = (value?: string): string =>
	pipe(
		Option.fromNullable(value),
		Option.map(serverDateToDisplayDate),
		Option.getOrElse(() => 'Any')
	);
const formatAmount = (value?: number): string =>
	pipe(
		Option.fromNullable(value),
		Option.map(formatCurrency),
		Option.getOrElse(() => 'Any')
	);

const RuleCell = (props: RuleProps) => {
	const startDate = formatDate(props.rule.startDate);
	const endDate = formatDate(props.rule.endDate);
	const minAmount = formatAmount(props.rule.minAmount);
	const maxAmount = formatAmount(props.rule.maxAmount);
	return (
		<ul>
			<li>
				<strong>Regex: </strong>
				<span>/{props.rule.regex}/</span>
			</li>
			<li>
				<strong>Dates: </strong>
				<span>
					{startDate} to {endDate}
				</span>
			</li>
			<li>
				<strong>Amounts: </strong>
				<span>
					{minAmount} to {maxAmount}
				</span>
			</li>
		</ul>
	);
};

export const RulesTable = (props: Props) => {
	const { currentPage, totalItems, rules, isFetching } = useGetAllRulesData(
		props.pagination
	);

	const paginationConfig = createTablePagination(
		currentPage,
		props.pagination.pageSize,
		totalItems,
		props.onPaginationChange
	);

	return (
		<div className="AutoCategorizeRulesTable">
			<Table
				columns={COLUMNS}
				loading={isFetching}
				pagination={paginationConfig}
			>
				{rules.map((rule) => (
					<TableRow key={rule.id}>
						<TableCell>{rule.ordinal}</TableCell>
						<TableCell>{rule.categoryName}</TableCell>
						<TableCell>
							<RuleCell rule={rule} />
						</TableCell>
					</TableRow>
				))}
			</Table>
		</div>
	);
};
