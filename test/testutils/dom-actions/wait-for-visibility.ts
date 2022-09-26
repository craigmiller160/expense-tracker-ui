import { screen, waitFor } from '@testing-library/react';

export type ItemText = {
	readonly text: string;
	readonly occurs?: number;
};

export const waitForVisibility = async (
	allItemsText: ReadonlyArray<ItemText>
): Promise<void> => {
	// Imperative is necessary to enforce ordering of async behavior
	for (let i = 0; i < allItemsText.length; i++) {
		const foundItems = await waitFor(() => {
			const items = screen.queryAllByText(allItemsText[i].text);
			expect(items).toHaveLength(allItemsText[i].occurs ?? 1);
			return items;
		});
		foundItems.forEach((item) => expect(item).toBeVisible());
	}
};
