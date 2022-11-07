import Chainable = Cypress.Chainable;

const getTitle = (): Chainable<JQuery> => cy.get('.Categories h4');
const getTableRows = (): Chainable<JQuery> =>
	cy.get('.Categories table tbody tr');
const getCategoryNames = (): Chainable<JQuery> =>
	getTableRows().find('td:nth-of-type(1)');
const getDetailsButtons = (): Chainable<JQuery> =>
	getTableRows().find('td:nth-of-type(2)');
const getAddButton = (): Chainable<JQuery> => cy.get('.ActionWrapper button');

export const categoriesListPage = {
	getTitle,
	getTableRows,
	getCategoryNames,
	getDetailsButtons,
	getAddButton
};
