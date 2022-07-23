import { OptionT } from '@craigmiller160/ts-functions/es/types';
import { TransactionResponse } from '../../../types/transactions';
import { SideDialog } from '../../UI/SideDialog';
import * as Option from 'fp-ts/es6/Option';
import { Button } from '@mui/material';
import { pipe } from 'fp-ts/es6/function';
import './TransactionDetailsDialog.scss';
import { useForm } from 'react-hook-form';

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

export const TransactionDetailsDialog = (props: Props) => {
	// TODO need to make sure the flags change with user interaction
	const hasTransaction = Option.isSome(props.selectedTransaction);
	const id = pipe(
		props.selectedTransaction,
		Option.map((txn) => txn.id),
		Option.getOrElse(() => '')
	);
	const { handleSubmit, control, reset, formState } = useForm<FormData>();

	const Actions = (
		<TransactionDetailsDialogActions
			deleteTransaction={() => props.deleteTransaction(id)}
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
				<div className="Flags"></div>
			</div>
		</SideDialog>
	);
};
