import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { Popover } from '../../../UI/Popover';
import './TransactionIcon.scss';

interface Props {
	readonly isNotConfirmed: boolean;
}

const conditionalVisible = (condition: boolean): string =>
	condition ? 'visible' : '';

export const NotConfirmedIcon = (props: Props) => {
	const className = `TransactionIcon ${conditionalVisible(
		props.isNotConfirmed
	)}`;
	return (
		<Popover
			className={className}
			message="Transaction has not been confirmed"
			data-testid="not-confirmed-icon"
		>
			<ThumbDownIcon color="warning" />
		</Popover>
	);
};
