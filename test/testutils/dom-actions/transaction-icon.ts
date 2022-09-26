import { TransactionIconTestId } from '../../../src/components/Content/Transactions/icons/TransactionIcon';
import { getSelectorParent } from './utils';

type NoArgVoidFn = () => void;
export type TransactionIcon = {
	isVisible: NoArgVoidFn;
	isInvisible: NoArgVoidFn;
};

export const transactionIcon = (
	testId: TransactionIconTestId,
	root?: HTMLElement
): TransactionIcon => {
	const icon = getSelectorParent(root).getByTestId(testId);
	const isVisible = () => expect(icon.className).toMatch(/visible/);
	const isInvisible = () => expect(icon.className).not.toMatch(/visible/);
	return {
		isVisible,
		isInvisible
	};
};
