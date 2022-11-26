import {
	createTablePagination,
	PaginationState
} from '../../../utils/pagination';
import { Updater } from 'use-immer';
import { Table } from '../../UI/Table';
import { Button } from '@mui/material';
import './RulesTable.scss';
import { AutoCategorizeRuleResponse } from '../../../types/generated/expense-tracker';
import { ReactNode } from 'react';
import { ReOrderActions } from './useHandleAllRulesData';
import { RuleTableRow } from './common/RuleTableRow';

const COLUMNS = ['Ordinal', 'Category', 'Rule', 'Actions'];

type Props = {
	readonly currentPage: number;
	readonly totalItems: number;
	readonly pageSize: number;
	readonly rules: ReadonlyArray<AutoCategorizeRuleResponse>;
	readonly isFetching: boolean;
	readonly onPaginationChange: Updater<PaginationState>;
	readonly openDialog: (ruleId?: string) => void;
	readonly maxOrdinal: number;
	readonly reOrder: ReOrderActions;
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
					<RuleTableRow
						key={rule.id}
						rule={rule}
						actions={{
							maxOrdinal: props.maxOrdinal,
							reOrder: props.reOrder,
							openDialog: props.openDialog
						}}
					/>
				))}
			</Table>
		</div>
	);
};
