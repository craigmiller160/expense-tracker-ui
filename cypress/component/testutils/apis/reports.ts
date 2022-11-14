import Chainable = Cypress.Chainable;

const getSpendingByMonthAndCategory = (): Chainable<null> =>
	cy.intercept('/expense-tracker/api/reports?*', {
		fixture: 'reports.json'
	});

export const reportsApi = {
	getSpendingByMonthAndCategory
};
