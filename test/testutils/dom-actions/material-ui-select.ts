import { pipe } from 'fp-ts/es6/function';
import * as Option from 'fp-ts/es6/Option';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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
	const select = pipe(
		Option.fromNullable(root),
		Option.fold(
			() => screen.getByLabelText(labelText),
			(r) => within(r).getByLabelText(labelText)
		)
	);
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
