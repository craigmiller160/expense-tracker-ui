import Chainable = Cypress.Chainable;

const getTitle = (): Chainable<JQuery> => cy.get('.Welcome h4');

export const welcomePage = {
	getTitle
};
