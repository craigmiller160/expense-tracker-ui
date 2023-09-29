import { getSelectorParent } from './utils';

export type Item = {
	readonly text: string;
	readonly occurs?: number;
};

export const textExists = (items: ReadonlyArray<Item>, root?: HTMLElement) => {
	const selectorParent = getSelectorParent(root);
	items.forEach((item) => {
		// eslint-disable-next-line testing-library/prefer-screen-queries
		expect(selectorParent.getAllByText(item.text)).toHaveLength(
			item.occurs ?? 1
		);
	});
};
