import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as Time from '@craigmiller160/ts-functions/es/Time';

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
	datePickerLabel: string,
	ariaFormattedDateString: string
) => {
	const datePickerLabelElement = screen.getByLabelText(datePickerLabel);
	const openPickerButton =
		datePickerLabelElement.parentElement?.querySelector(
			'div.MuiInputAdornment-root > button'
		);
	expect(openPickerButton).toBeTruthy();
	await userEvent.click(
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		openPickerButton!
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

export const getTotalDaysInRange = (startDate: Date, endDate: Date): number =>
	Time.differenceInDays(endDate)(startDate) + 1;