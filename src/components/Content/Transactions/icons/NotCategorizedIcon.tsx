import CategoryIcon from '@mui/icons-material/Category';
import { TransactionIcon } from './TransactionIcon';
import type { CategoryOption } from '../../../../types/categories';
import type { DeepPartial } from 'react-hook-form';

type PartialTransactionForm = {
	readonly category: CategoryOption | null;
};

interface Props {
	readonly transaction?: DeepPartial<PartialTransactionForm>;
}

export const NotCategorizedIcon = (props: Props) => (
	<TransactionIcon
		isVisible={!props.transaction?.category}
		icon={<CategoryIcon color="warning" />}
		testId="no-category-icon"
		message="Transaction has not been categorized. Please assign a category to this transaction."
	/>
);
