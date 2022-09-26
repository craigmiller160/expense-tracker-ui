import { pipe } from 'fp-ts/es6/function';
import * as Option from 'fp-ts/es6/Option';
import { screen, within } from '@testing-library/react';

type HasValueFn = (value: string) => void;
export type MaterialUiSelect = {
	readonly hasValue: HasValueFn;
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
	return {
		hasValue
	};
};
