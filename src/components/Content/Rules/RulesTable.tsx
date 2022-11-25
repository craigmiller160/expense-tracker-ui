import {
	createTablePagination,
	PaginationState
} from '../../../utils/pagination';
import { Updater } from 'use-immer';
import { Table } from '../../UI/Table';
import { Button, TableCell, TableRow } from '@mui/material';
import './RulesTable.scss';
import { AutoCategorizeRuleResponse } from '../../../types/generated/expense-tracker';
import { pipe } from 'fp-ts/es6/function';
import * as Option from 'fp-ts/es6/Option';
import { serverDateToDisplayDate } from '../../../utils/dateTimeUtils';
import { formatCurrency } from '../../../utils/formatNumbers';
import { ReactNode } from 'react';

const COLUMNS = ['Ordinal', 'Category', 'Rule', 'Actions'];

type Props = {
	readonly currentPage: number;
	readonly totalItems: number;
	readonly pageSize: number;
	readonly rules: ReadonlyArray<AutoCategorizeRuleResponse>;
	readonly isFetching: boolean;
	readonly onPaginationChange: Updater<PaginationState>;
	readonly openDialog: (ruleId?: string) => void;
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

const createAboveTableActions = (
	openDialog: () => void
): ReadonlyArray<ReactNode> => [
	<Button
		id="AddRuleBtn"
		key="add-rule"
		variant="contained"
		color="primary"
		onClick={openDialog}
	>
		Add Rule
	</Button>
];

export const RulesTable = (props: Props) => {
	const paginationConfig = createTablePagination(
		props.currentPage,
		props.pageSize,
		props.totalItems,
		props.onPaginationChange
	);

	const aboveTableActions = createAboveTableActions(() => props.openDialog());

	return (
		<div className="AutoCategorizeRulesTable">
			<Table
				columns={COLUMNS}
				loading={props.isFetching}
				pagination={paginationConfig}
				aboveTableActions={aboveTableActions}
			>
				{props.rules.map((rule) => (
					<TableRow key={rule.id}>
						<TableCell>{rule.ordinal}</TableCell>
						<TableCell>{rule.categoryName}</TableCell>
						<TableCell>
							<RuleCell rule={rule} />
						</TableCell>
						<TableCell>
							<div className="ActionsCell">
								<div className="ReOrderButtons">
									<Button>Up</Button>
									<Button>Down</Button>
								</div>
								<div className="DetailsButton">
									<Button
										className="RuleDetailsButton"
										variant="contained"
										onClick={() =>
											props.openDialog(rule.id)
										}
									>
										Details
									</Button>
								</div>
							</div>
						</TableCell>
					</TableRow>
				))}
			</Table>
		</div>
	);
};
