import Chainable = Cypress.Chainable;

const getTitle = (): Chainable<JQuery> => cy.get('.import-transactions h4');

export const importPage = {
	getTitle
};
