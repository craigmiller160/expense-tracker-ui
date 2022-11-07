import Chainable = Cypress.Chainable;

const getTitle = (): Chainable<JQuery> => cy.get('.Categories h4');
const getTableRows = (): Chainable<JQuery> =>
	cy.get('.Categories table tbody tr');

export const categoriesPage = {
	getTitle,
	getTableRows
};
