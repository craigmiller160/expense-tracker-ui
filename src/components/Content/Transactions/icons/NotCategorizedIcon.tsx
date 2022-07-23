import './TransactionIcon.scss';
import CategoryIcon from '@mui/icons-material/Category';
import { Popover } from '../../../UI/Popover';

interface Props {
	readonly isNotCategorized: boolean;
}

const conditionalVisible = (condition: boolean): string =>
	condition ? 'visible' : '';

export const NotCategorizedIcon = (props: Props) => {
	const className = `TransactionIcon ${conditionalVisible(
		props.isNotCategorized
	)}`;
	return (
		<Popover
			className={className}
			message="Transaction has not been categorized"
			data-testid="no-category-icon"
		>
			<CategoryIcon color="warning" />
		</Popover>
	);
};
