import { OptionT } from '@craigmiller160/ts-functions/es/types';
import { TransactionResponse } from '../../../types/transactions';
import { SideDialog } from '../../UI/SideDialog';
import * as Option from 'fp-ts/es6/Option';

interface Props {
	readonly selectedTransaction: OptionT<TransactionResponse>;
	readonly onClose: () => void;
	readonly saveTransaction: (transaction: TransactionResponse) => void;
	readonly deleteTransaction: (id: string) => void;
}

export const TransactionDetailsDialog = (props: Props) => {
	// TODO consider different transaction details
	const hasTransaction = Option.isSome(props.selectedTransaction);
	return (
		<SideDialog
			open={hasTransaction}
			onClose={props.onClose}
			title="Transaction Details"
		>
			<h1>Details Go Here</h1>
		</SideDialog>
	);
};
