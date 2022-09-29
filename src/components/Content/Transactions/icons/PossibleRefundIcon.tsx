import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { TransactionIcon } from './TransactionIcon';

type PartialTransaction = {
	readonly amount: number | string;
};

type Props = {
	readonly transaction: PartialTransaction;
};

export const PossibleRefundIcon = (props: Props) => (
	<TransactionIcon
		isVisible={props.transaction.amount < 0}
		icon={<AttachMoneyIcon color="warning" />}
		testId="possible-refund-icon"
		message="Transaction is a possible refund"
	/>
);
