import FileCopyIcon from '@mui/icons-material/FileCopy';
import { Popover } from '../../../UI/Popover';
import './TransactionIcon.scss';

interface Props {
	readonly isDuplicate: boolean;
}

const conditionalVisible = (condition: boolean): string =>
	condition ? 'visible' : '';

export const DuplicateIcon = (props: Props) => {
	const className = `TransactionIcon ${conditionalVisible(
		props.isDuplicate
	)}`;
	return (
		<Popover
			className={className}
			message="Transaction is a duplicate"
			data-testid="duplicate-icon"
		>
			<FileCopyIcon color="warning" />
		</Popover>
	);
};
