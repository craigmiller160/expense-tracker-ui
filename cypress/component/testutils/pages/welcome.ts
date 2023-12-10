type Chainable<T> = Cypress.Chainable<T>;

const getTitle = (): Chainable<JQuery> => cy.get('.welcome h4');

export const welcomePage = {
	getTitle
};
