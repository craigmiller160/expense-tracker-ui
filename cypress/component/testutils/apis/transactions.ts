import Chainable = Cypress.Chainable;

const searchForTransactions = (): Chainable<null> =>
	cy.intercept('/expense-tracker/api/transactions?*', {
		fixture: 'allTransactions.json'
	});

export const transactionsApi = {
	searchForTransactions
};
