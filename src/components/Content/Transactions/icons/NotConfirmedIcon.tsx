import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { TransactionIcon } from './TransactionIcon';

interface Props {
	readonly isNotConfirmed: boolean;
}

export const NotConfirmedIcon = (props: Props) => (
	<TransactionIcon
		isVisible={props.isNotConfirmed}
		icon={<ThumbDownIcon color="warning" />}
		testId="not-confirmed-icon"
		message="Transaction has not been confirmed"
	/>
);
