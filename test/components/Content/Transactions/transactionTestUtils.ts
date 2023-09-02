import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as Time from '@craigmiller160/ts-functions/es/Time';
import { TestTransactionDescription } from '../../../testutils/transactionDataUtils';
import { TryT } from '@craigmiller160/ts-functions/es/types';
import { flow, pipe } from 'fp-ts/function';
import * as Try from '@craigmiller160/ts-functions/es/Try';
import * as Either from 'fp-ts/Either';
import * as Json from '@craigmiller160/ts-functions/es/Json';
import * as RArray from 'fp-ts/ReadonlyArray';

export const getOrderByValueElement = (): HTMLElement | null | undefined => {
	const transactionFilters = screen.getByTestId('transaction-filters');
	const orderByLabel = within(transactionFilters).getByLabelText('Order By');
	return orderByLabel?.parentElement?.querySelector(
		'.MuiOutlinedInput-input'
	);
};

export const getSelectValueElement = (
	label: string
): HTMLElement | null | undefined => {
	const transactionFilters = screen.getByTestId('transaction-filters');
	const categoryLabel = within(transactionFilters).getByLabelText(label);
	return categoryLabel?.parentElement?.querySelector(
		'.MuiOutlinedInput-input'
	);
};

export const selectDate = async (
	datePickerLabel: string,
	dateString: string
) => {
	const datePickerElement = screen.getByLabelText(datePickerLabel);
	await userEvent.clear(datePickerElement);
	await userEvent.type(datePickerElement, dateString);
	expect(datePickerElement).toHaveValue(dateString);
};

export const getRecordRangeText = (): string | undefined =>
	screen
		.queryByText(/.*\d+–\d+ of \d+.*/)
		?.textContent?.trim()
		?.replace('–', '-');

export const getTotalDaysInRange = (startDate: Date, endDate: Date): number =>
	Time.differenceInDays(endDate)(startDate) + 1;

type ValidateDescription = (
	index: number,
	description: TestTransactionDescription
) => void;

const validateTransactionDescription =
	(validateDescription: ValidateDescription) =>
	(index: number, description: TestTransactionDescription): TryT<unknown> =>
		pipe(
			Try.tryCatch(() => validateDescription(index, description)),
			Either.mapLeft(
				(ex) =>
					new Error(
						`Error validating description ${JSON.stringify(
							description
						)}: ${ex.message}`,
						{
							cause: ex
						}
					)
			)
		);

const validateNullableTextAndParse = (
	descriptionElement: HTMLElement
): TryT<TestTransactionDescription> => {
	if (descriptionElement.textContent === null) {
		return Either.left(
			new Error('Description text content cannot be null')
		);
	}
	return Json.parseE<TestTransactionDescription>(
		descriptionElement.textContent
	);
};

export const validateTransactionsInTable = async (
	count: number,
	validateDescription: ValidateDescription
) => {
	const descriptions = await waitFor(() =>
		screen.getAllByTestId('transaction-description')
	);
	expect(descriptions).toHaveLength(count);
	const result = pipe(
		descriptions,
		RArray.map(validateNullableTextAndParse),
		Either.sequenceArray,
		Either.chain(
			flow(
				RArray.mapWithIndex(
					validateTransactionDescription(validateDescription)
				),
				Either.sequenceArray
			)
		)
	);
	if (Either.isLeft(result)) {
		throw result.left;
	}
};
