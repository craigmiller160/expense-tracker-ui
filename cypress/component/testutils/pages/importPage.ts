type Chainable<T> = Cypress.Chainable<T>;

const getTitle = (): Chainable<JQuery> => cy.get('.import-transactions h4');

export const importPage = {
	getTitle
};
