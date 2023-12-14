type Chainable<T> = Cypress.Chainable<T>;

const getTitle = (): Chainable<JQuery> =>
	cy.findByRole('heading', {
		level: 4
	});
const getTableRows = (): Chainable<JQuery> =>
	cy.get('.categories table tbody tr');
const getCategoryNames = (): Chainable<JQuery> =>
	getTableRows().find('td:nth-of-type(2)');
const getDetailsButtons = (): Chainable<JQuery> =>
	getTableRows().find('td:nth-of-type(3) button');
const getAddButton = (): Chainable<JQuery> => cy.get('.action-wrapper button');

export const categoriesListPage = {
	getTitle,
	getTableRows,
	getCategoryNames,
	getDetailsButtons,
	getAddButton
};
