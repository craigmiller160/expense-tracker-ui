import Chainable = Cypress.Chainable;

const getTitle = (): Chainable<JQuery> => cy.get('.ManageTransactions h4');
const getDetailsButtons = (): Chainable<JQuery> =>
	cy.get('.ManageTransactions table .DetailsButton');

export const transactionsListPage = {
	getTitle,
	getDetailsButtons
};
