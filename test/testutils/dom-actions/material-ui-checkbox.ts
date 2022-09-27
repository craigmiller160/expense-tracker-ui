import { getSelectorParent } from './utils';
import { match } from 'ts-pattern';
import userEvent from '@testing-library/user-event';

type SelectorType = 'testid' | 'label';

type Selector = {
	readonly selector: string;
	readonly type: SelectorType;
	readonly root?: HTMLElement;
};

type NoArgVoidFn = () => void;
export type MaterialUiCheckbox = {
	click: NoArgVoidFn;
	isChecked: NoArgVoidFn;
	isNotChecked: NoArgVoidFn;
};

export const materialUiCheckbox = (selector: Selector): MaterialUiCheckbox => {
	const selectorParent = getSelectorParent(selector.root);
	const checkbox = match(selector.type)
		.with('testid', () => selectorParent.getByTestId(selector.selector))
		.otherwise(() => selectorParent.getByLabelText(selector.selector));
	const checkboxInput = checkbox.querySelector('input');

	const click: NoArgVoidFn = () => userEvent.click(checkbox);
	const isChecked: NoArgVoidFn = () => expect(checkboxInput).toBeChecked();
	const isNotChecked: NoArgVoidFn = () =>
		expect(checkboxInput).not.toBeChecked();
	return {
		click,
		isChecked,
		isNotChecked
	};
};
