import CategoryIcon from '@mui/icons-material/Category';
import { TransactionIcon } from './TransactionIcon';

interface Props {
	readonly isNotCategorized: boolean;
}

export const NotCategorizedIcon = (props: Props) => (
	<TransactionIcon
		isVisible={props.isNotCategorized}
		icon={<CategoryIcon color="warning" />}
		testId="no-category-icon"
		message="Transaction has not been categorized"
	/>
);
