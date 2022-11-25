import './RuleTableRow.scss';
import { AutoCategorizeRuleResponse } from '../../../../types/generated/expense-tracker';
import { Button, TableCell, TableRow } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { ReOrderActions } from '../useHandleAllRulesData';
import { pipe } from 'fp-ts/es6/function';
import * as Option from 'fp-ts/es6/Option';
import { serverDateToDisplayDate } from '../../../../utils/dateTimeUtils';
import { formatCurrency } from '../../../../utils/formatNumbers';

type Props = {
	readonly rule: AutoCategorizeRuleResponse;
	readonly actions?: {
		readonly maxOrdinal: number;
		readonly reOrder: ReOrderActions;
		readonly openDialog: (id?: string) => void;
	};
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

export const RuleTableRow = (props: Props) => {
	const upClassName =
		props.rule.ordinal === 1 ? 'UpButton invisible' : 'UpButton';
	const downClassName =
		props.rule.ordinal === props.actions?.maxOrdinal
			? 'DownButton invisible'
			: 'DownButton';

	return (
		<TableRow>
			<TableCell>{props.rule.ordinal}</TableCell>
			<TableCell>{props.rule.categoryName}</TableCell>
			<TableCell>
				<RuleCell rule={props.rule} />
			</TableCell>
			{props.actions && (
				<TableCell>
					<div className="ActionsCell">
						<div className="ReOrderButtons">
							<Button
								className={upClassName}
								onClick={() =>
									props.actions?.reOrder.decrementRuleOrdinal(
										props.rule
									)
								}
							>
								<ArrowDropUpIcon />
							</Button>
							<Button
								className={downClassName}
								onClick={() =>
									props.actions?.reOrder.incrementRuleOrdinal(
										props.rule
									)
								}
							>
								<ArrowDropDownIcon />
							</Button>
						</div>
						<div className="DetailsButton">
							<Button
								className="RuleDetailsButton"
								variant="contained"
								onClick={() =>
									props.actions?.openDialog(props.rule.id)
								}
							>
								Details
							</Button>
						</div>
					</div>
				</TableCell>
			)}
		</TableRow>
	);
};
