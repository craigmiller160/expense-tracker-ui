import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { TransactionIcon } from './TransactionIcon';

type PartialTransactionForm = {
	readonly confirmed: boolean;
};

interface Props {
	readonly transaction: PartialTransactionForm;
}

export const NotConfirmedIcon = (props: Props) => (
	<TransactionIcon
		isVisible={!props.transaction.confirmed}
		icon={<ThumbDownIcon color="warning" />}
		testId="not-confirmed-icon"
		message="Transaction has not been confirmed. Please check that all transaction settings are correct and then confirm."
	/>
);
