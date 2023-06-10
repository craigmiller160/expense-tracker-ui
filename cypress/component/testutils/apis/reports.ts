import Chainable = Cypress.Chainable;

const getDefaultSpendingByMonthAndCategory = (): Chainable<null> =>
	cy
		.intercept('/expense-tracker/api/reports?*', {
			fixture: 'reports.json'
		})
		.as('getSpendingByMonthAndCategory');

const getSpendingByMonthAndCategory = (
	query: string,
	alias: string
): Chainable<null> =>
	cy
		.intercept(`/expense-tracker/api/reports?${query}`, {
			fixture: 'reports.json'
		})
		.as(alias);

export const reportsApi = {
	getDefaultSpendingByMonthAndCategory,
	getSpendingByMonthAndCategory
};
