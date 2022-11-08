import Chainable = Cypress.Chainable;

const getTitle = (): Chainable<JQuery> => cy.get('.ManageTransactions h4');
const getDetailsButtons = (): Chainable<JQuery> =>
	cy.get('.ManageTransactions table .DetailsButton');
const getAddTransactionButton = (): Chainable<JQuery> =>
	cy.get(
		'.ManageTransactions .TransactionsTable .AboveTableActionWrapper button'
	);

export const transactionsListPage = {
	getTitle,
	getDetailsButtons,
	getAddTransactionButton
};
