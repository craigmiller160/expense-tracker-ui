import CategoryIcon from '@mui/icons-material/Category';
import { TransactionIcon } from './TransactionIcon';
import { CategoryOption } from '../utils';

type PartialTransactionForm = {
	readonly category: CategoryOption | null;
};

interface Props {
	readonly transaction: PartialTransactionForm;
}

export const NotCategorizedIcon = (props: Props) => (
	<TransactionIcon
		isVisible={props.transaction.category === null}
		icon={<CategoryIcon color="warning" />}
		testId="no-category-icon"
		message="Transaction has not been categorized"
	/>
);
