import FileCopyIcon from '@mui/icons-material/FileCopy';
import { TransactionIcon } from './TransactionIcon';

type PartialTransaction = {
	readonly duplicate: boolean;
};

interface Props {
	readonly transaction: PartialTransaction;
}

export const DuplicateIcon = (props: Props) => (
	<TransactionIcon
		isVisible={props.transaction.duplicate}
		icon={<FileCopyIcon color="warning" />}
		testId="duplicate-icon"
		message="Transaction is a duplicate. Please either mark as not a duplicate or remove one of the duplicated transactions."
	/>
);
