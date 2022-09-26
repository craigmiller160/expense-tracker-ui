import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getSelectorParent } from './utils';

type HasValueFn = (value: string) => void;
type SelectItemFn = (itemLabel: string) => Promise<void>;
export type MaterialUiSelect = {
	readonly hasValue: HasValueFn;
	readonly selectItem: SelectItemFn;
};

export const materialUiSelect = (
	labelText: string,
	root?: HTMLElement
): MaterialUiSelect => {
	const select = getSelectorParent(root).getByLabelText(labelText);
	const hasValue: HasValueFn = expect(select).toHaveValue;
	const selectItem: SelectItemFn = async (itemLabel) => {
		await userEvent.click(select);
		expect(screen.queryByText(itemLabel)).toBeVisible();
		await userEvent.click(screen.getByText(itemLabel));
	};
	return {
		hasValue,
		selectItem
	};
};
