import Chainable = Cypress.Chainable;

const getTitle = (): Chainable<JQuery> => cy.get('.ImportTransactions h4');

export const importPage = {
	getTitle
};
