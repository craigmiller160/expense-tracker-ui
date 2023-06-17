import {
	getMonthAndCategoryLink,
	getMonthLink
} from '../../../../src/components/Content/Reports/utils';

describe('Reports utils', () => {
	it('getMonthLink', () => {
		const link = getMonthLink('2022-01-12');
		expect(link).toEqual(
			'/expense-tracker/transactions?startDate=2022-01-01&endDate=2022-01-31'
		);
	});

	it('getMonthAndCategoryLink', () => {
		const link = getMonthAndCategoryLink(
			'2022-01-12',
			'c0792ddd-381d-4724-a4b2-790929aff827'
		);
		expect(link).toEqual(
			'/expense-tracker/transactions?startDate=2022-01-01&endDate=2022-01-31&category=c0792ddd-381d-4724-a4b2-790929aff827'
		);
	});
});
