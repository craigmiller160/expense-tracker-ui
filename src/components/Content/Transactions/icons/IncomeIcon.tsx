import { TransactionIcon } from './TransactionIcon';

type PartialTransaction = {
	readonly amount: number;
};

type Props = {
	readonly transaction: PartialTransaction;
};

export const IncomeIcon = (props: Props) => (
	<TransactionIcon isVisible={} icon={} testId={} message={} />
);
