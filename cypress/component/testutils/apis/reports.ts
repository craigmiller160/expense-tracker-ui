import Chainable = Cypress.Chainable;

const getDefaultSpendingByMonthAndCategory = (): Chainable<null> =>
	cy
		.intercept(
			'/expense-tracker/api/reports?pageNumber=0&pageSize=10&categoryIdType=INCLUDE',
			{
				fixture: 'report_categories.json'
			}
		)
		.as('getSpendingByMonthAndCategory');

const getSpendingByMonthAndCategory = (
	query: string,
	alias: string
): Chainable<null> =>
	cy
		.intercept(
			`/expense-tracker/api/reports?pageNumber=0&pageSize=10&${query}`,
			{
				fixture: 'report_categories.json'
			}
		)
		.as(alias);

export const reportsApi = {
	getDefaultSpendingByMonthAndCategory,
	getSpendingByMonthAndCategory
};
