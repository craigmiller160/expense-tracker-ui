import Chainable = Cypress.Chainable;

const getSpendingByMonthAndCategory = (): Chainable<null> =>
	cy
		.intercept('/expense-tracker/api/reports?*', {
			fixture: 'reports.json'
		})
		.as('getSpendingByMonthAndCategory');

export const reportsApi = {
	getSpendingByMonthAndCategory
};
