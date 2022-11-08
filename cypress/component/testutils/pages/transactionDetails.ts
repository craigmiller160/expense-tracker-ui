import Chainable = Cypress.Chainable;

const getHeaderTitle = (): Chainable<JQuery> =>
	cy.get('#TransactionDetailsDialog-header .MuiToolbar-root h6');
const getContentTitle = (): Chainable<JQuery> =>
	cy.get('#TransactionDetailsDialog-body h6');

export const transactionDetailsPage = {
	getHeaderTitle,
	getContentTitle
};
