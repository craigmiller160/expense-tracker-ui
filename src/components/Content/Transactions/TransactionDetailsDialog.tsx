import { OptionT } from '@craigmiller160/ts-functions/es/types';
import { TransactionResponse } from '../../../types/transactions';
import { SideDialog } from '../../UI/SideDialog';
import * as Option from 'fp-ts/es6/Option';
import { Button, Typography } from '@mui/material';
import { flow, pipe } from 'fp-ts/es6/function';
import './TransactionDetailsDialog.scss';
import { useForm } from 'react-hook-form';
import { DuplicateIcon } from './icons/DuplicateIcon';
import { NotConfirmedIcon } from './icons/NotConfirmedIcon';
import { NotCategorizedIcon } from './icons/NotCategorizedIcon';
import { formatCurrency } from '../../../utils/formatCurrency';

interface FormData {}

interface Props {
	readonly selectedTransaction: OptionT<TransactionResponse>;
	readonly onClose: () => void;
	readonly saveTransaction: (transaction: TransactionResponse) => void;
	readonly deleteTransaction: (id: string) => void;
}

interface DialogActionsProps {
	readonly deleteTransaction: () => void;
}

const TransactionDetailsDialogActions = (props: DialogActionsProps) => (
	<div className="TransactionDetailsActions">
		<Button
			variant="contained"
			color="success"
			disabled={true}
			type="submit"
		>
			Save
		</Button>
		<Button
			variant="contained"
			color="error"
			onClick={props.deleteTransaction}
		>
			Delete
		</Button>
	</div>
);

const getId: (txn: OptionT<TransactionResponse>) => string = flow(
	Option.map((txn) => txn.id),
	Option.getOrElse(() => '')
);
const getDuplicate: (txn: OptionT<TransactionResponse>) => boolean =
	Option.exists((txn) => txn.duplicate);
const getNotConfirmed: (txn: OptionT<TransactionResponse>) => boolean =
	Option.exists((txn) => !txn.confirmed);
const getNotCategorized: (txn: OptionT<TransactionResponse>) => boolean =
	Option.exists((txn) => !txn.categoryId);
const getDate: (txn: OptionT<TransactionResponse>) => string = flow(
	Option.map((txn) => txn.expenseDate),
	Option.getOrElse(() => '')
);
const getDescription: (txn: OptionT<TransactionResponse>) => string = flow(
	Option.map((txn) => txn.description),
	Option.getOrElse(() => '')
);
const getAmount: (txn: OptionT<TransactionResponse>) => string = flow(
	Option.map((txn) => txn.amount),
	Option.map(formatCurrency),
	Option.getOrElse(() => '')
);

export const TransactionDetailsDialog = (props: Props) => {
	// TODO need to make sure the flags change with user interaction
	const hasTransaction = Option.isSome(props.selectedTransaction);
	const { handleSubmit, control, reset, formState } = useForm<FormData>();

	const Actions = (
		<TransactionDetailsDialogActions
			deleteTransaction={() =>
				props.deleteTransaction(getId(props.selectedTransaction))
			}
		/>
	);

	const onSubmit = (values: FormData) => {};

	return (
		<SideDialog
			open={hasTransaction}
			onClose={props.onClose}
			title="Transaction Details"
			actions={Actions}
			formSubmit={handleSubmit(onSubmit)}
		>
			<div className="TransactionDetailsDialog">
				<div className="Flags">
					<DuplicateIcon
						isDuplicate={getDuplicate(props.selectedTransaction)}
					/>
					<NotConfirmedIcon
						isNotConfirmed={getNotConfirmed(
							props.selectedTransaction
						)}
					/>
					<NotCategorizedIcon
						isNotCategorized={getNotConfirmed(
							props.selectedTransaction
						)}
					/>
				</div>
				<div className="Info">
					<div className="InfoRow">
						<Typography variant="h6">
							<strong>Expense Date</strong>
						</Typography>
						<Typography variant="h6">
							{getDate(props.selectedTransaction)}
						</Typography>
					</div>
					<div className="InfoRow">
						<Typography variant="h6">
							<strong>Description</strong>
						</Typography>
						<Typography variant="h6">
							{getDescription(props.selectedTransaction)}
						</Typography>
					</div>
					<div className="InfoRow">
						<Typography variant="h6">
							<strong>Amount</strong>
						</Typography>
						<Typography variant="h6">
							{getAmount(props.selectedTransaction)}
						</Typography>
					</div>
				</div>
			</div>
		</SideDialog>
	);
};
