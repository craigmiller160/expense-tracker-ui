import { pipe } from 'fp-ts/function';
import * as Option from 'fp-ts/Option';
import { screen, within } from '@testing-library/react';

type SelectorParent = {
	readonly getByTestId: (testId: string) => HTMLElement;
	readonly getByLabelText: (labelText: string) => HTMLElement;
	readonly getByText: (text: string) => HTMLElement;
	readonly getAllByText: (text: string) => ReadonlyArray<HTMLElement>;
};

export const getSelectorParent = (customRoot?: HTMLElement): SelectorParent =>
	pipe(
		Option.fromNullable(customRoot),
		Option.fold(
			() => screen,
			(_) => within(_)
		)
	);
