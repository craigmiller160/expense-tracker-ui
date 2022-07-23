import { OptionT } from '@craigmiller160/ts-functions/es/types';
import { TransactionResponse } from '../../../types/transactions';
import { SideDialog } from '../../UI/SideDialog';
import * as Option from 'fp-ts/es6/Option';
import { Button } from '@mui/material';
import { pipe } from 'fp-ts/es6/function';
import './TransactionDetailsDialog.scss';

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

export const TransactionDetailsDialog = (props: Props) => {
	// TODO consider different transaction details
	const hasTransaction = Option.isSome(props.selectedTransaction);
	const id = pipe(
		props.selectedTransaction,
		Option.map((txn) => txn.id),
		Option.getOrElse(() => '')
	);

	const Actions = (
		<TransactionDetailsDialogActions
			deleteTransaction={() => props.deleteTransaction(id)}
		/>
	);

	return (
		<SideDialog
			open={hasTransaction}
			onClose={props.onClose}
			title="Transaction Details"
			actions={Actions}
		>
			<h1>Details Go Here</h1>
		</SideDialog>
	);
};
