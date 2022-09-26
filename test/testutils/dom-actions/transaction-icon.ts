import { TransactionIconTestId } from '../../../src/components/Content/Transactions/icons/TransactionIcon';
import { getSelectorParent } from './utils';

type NoArgVoidFn = () => void;
export type TransactionIcon = {
	isVisible: NoArgVoidFn;
	isNotVisible: NoArgVoidFn;
};

export const transactionIcon = (
	testId: TransactionIconTestId,
	root?: HTMLElement
): TransactionIcon => {
	const icon = getSelectorParent(root).getByTestId(testId);
	const isVisible = () => expect(icon.className).toMatch(/visible/);
	const isNotVisible = () => expect(icon.className).not.toMatch(/visible/);
	return {
		isVisible,
		isNotVisible
	};
};
