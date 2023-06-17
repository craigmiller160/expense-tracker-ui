import {
	getMonthAndCategoryLink,
	getMonthLink
} from '../../../../src/components/Content/Reports/utils';

const UNKNOWN_CATEGORY_ID = 'd908ec89-4a38-4f35-a1bf-d11ecd326e07';
const CATEGORY_ID = 'c0792ddd-381d-4724-a4b2-790929aff827';
const DATE = '2022-01-12';
const START_DATE = '2022-01-01';
const END_DATE = '2022-01-31';

describe('Reports utils', () => {
	it('getMonthLink', () => {
		const link = getMonthLink(DATE);
		expect(link).toEqual(
			`/expense-tracker/transactions?startDate=${START_DATE}&endDate=${END_DATE}`
		);
	});

	it('getMonthAndCategoryLink - category is known', () => {
		const link = getMonthAndCategoryLink(
			DATE,
			CATEGORY_ID,
			UNKNOWN_CATEGORY_ID
		);
		expect(link).toEqual(
			`/expense-tracker/transactions?startDate=${START_DATE}&endDate=${END_DATE}&category=${CATEGORY_ID}`
		);
	});

	it('getMonthAndCategoryLink - category is unknown', () => {
		throw new Error();
	});
});
