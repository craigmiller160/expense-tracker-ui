import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const getOrderByValueElement = (): HTMLElement | null | undefined => {
	const transactionFilters = screen.getByTestId('transaction-filters');
	const orderByLabel = within(transactionFilters).getByLabelText('Order By');
	return orderByLabel?.parentElement?.querySelector(
		'.MuiOutlinedInput-input'
	);
};

export const getCategoryValueElement = (): HTMLElement | null | undefined => {
	const transactionFilters = screen.getByTestId('transaction-filters');
	const categoryLabel = within(transactionFilters).getByLabelText('Category');
	return categoryLabel?.parentElement?.querySelector(
		'.MuiOutlinedInput-input'
	);
};

export const ARIA_LABEL_FORMAT = 'MMM d, yyyy';

export const selectDate = async (
	datePickerIndex: number,
	ariaFormattedDateString: string
) => {
	const transactionFilters = screen.getByTestId('transaction-filters');
	await userEvent.click(
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		transactionFilters.querySelectorAll(
			'button[aria-label = "Choose date"]'
		)[datePickerIndex]!
	);
	const popupDialog = screen.getByRole('dialog');
	const selectedDateButton = popupDialog.querySelector(
		`button[aria-label = "${ariaFormattedDateString}"]`
	);
	expect(selectedDateButton).not.toBeNull();
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	await userEvent.click(selectedDateButton!);
};

export const getRecordRangeText = (): string | undefined =>
	screen
		.queryByText(/.*\d+–\d+ of \d+.*/)
		?.textContent?.trim()
		?.replace('–', '-');
