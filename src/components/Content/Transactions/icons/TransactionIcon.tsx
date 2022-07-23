import './TransactionIcon.scss';
import { Popover } from '../../../UI/Popover';
import { ReactNode } from 'react';

interface Props {
	readonly isVisible: boolean;
	readonly icon: ReactNode;
	readonly testId: string;
	readonly message: string;
}

const conditionalVisible = (condition: boolean): string =>
	condition ? 'visible' : '';

export const TransactionIcon = (props: Props) => {
	const className = `TransactionIcon ${conditionalVisible(props.isVisible)}`;

	return (
		<Popover
			className={className}
			message={props.message}
			data-testid={props.testId}
		>
			{props.icon}
		</Popover>
	);
};
