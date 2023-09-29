import { screen, waitFor } from '@testing-library/react';
import userEvents from '@testing-library/user-event';
import { getSelectorParent } from './utils';

type HasValueFn = (value: string) => Promise<void>;
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
	const hasValue: HasValueFn = (value) =>
		waitFor(() => expect(select).toHaveValue(value));
	const selectItem: SelectItemFn = async (itemLabel) => {
		await userEvents.click(select);
		expect(screen.queryByText(itemLabel)).toBeVisible();
		await userEvents.click(screen.getByText(itemLabel));
	};
	return {
		hasValue,
		selectItem
	};
};
