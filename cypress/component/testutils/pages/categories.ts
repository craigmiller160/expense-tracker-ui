import Chainable = Cypress.Chainable;

const getTitle = (): Chainable<JQuery> => cy.get('.Categories h4');
const getTableRows = (): Chainable<JQuery> =>
	cy
		.get('.Categories table tr')
		// Skip the header
		.filter((index) => index > 0);

export const categoriesPage = {
	getTitle,
	getTableRows
};
