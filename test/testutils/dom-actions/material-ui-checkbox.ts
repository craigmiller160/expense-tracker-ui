import { expect } from 'vitest';
import { getSelectorParent } from './utils';
import { match } from 'ts-pattern';
import userEvents from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';

type SelectorType = 'testid' | 'label';

type Selector = {
	readonly selector: string;
	readonly type: SelectorType;
	readonly root?: HTMLElement;
};

type NoArgVoidFn = () => void;
type NoArgVoidPromiseFn = () => Promise<void>;
export type MaterialUiCheckbox = {
	click: NoArgVoidFn;
	isChecked: NoArgVoidPromiseFn;
	isNotChecked: NoArgVoidPromiseFn;
};

export const materialUiCheckbox = (selector: Selector): MaterialUiCheckbox => {
	const selectorParent = getSelectorParent(selector.root);
	const checkbox = match(selector.type)
		// eslint-disable-next-line testing-library/prefer-screen-queries
		.with('testid', () => selectorParent.getByTestId(selector.selector))
		// eslint-disable-next-line testing-library/prefer-screen-queries
		.otherwise(() => selectorParent.getByLabelText(selector.selector));
	// eslint-disable-next-line testing-library/no-node-access
	const checkboxInput = checkbox.querySelector('input');

	const click: NoArgVoidFn = () => userEvents.click(checkbox);
	const isChecked: NoArgVoidPromiseFn = () =>
		waitFor(() => expect(checkboxInput).toBeChecked());
	const isNotChecked: NoArgVoidPromiseFn = () =>
		waitFor(() => expect(checkboxInput).not.toBeChecked());
	return {
		click,
		isChecked,
		isNotChecked
	};
};
