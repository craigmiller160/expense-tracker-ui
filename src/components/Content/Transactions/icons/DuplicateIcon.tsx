import FileCopyIcon from '@mui/icons-material/FileCopy';
import { TransactionIcon } from './TransactionIcon';

interface Props {
	readonly isDuplicate: boolean;
}

export const DuplicateIcon = (props: Props) => (
	<TransactionIcon
		isVisible={props.isDuplicate}
		icon={<FileCopyIcon color="warning" />}
		testId="duplicate-icon"
		message="Transaction is a duplicate"
	/>
);
