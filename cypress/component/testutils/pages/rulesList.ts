import Chainable = Cypress.Chainable;

const getTitle = (): Chainable<JQuery> => cy.get('.AutoCategorizeRules h4');

export const rulesListPage = {
	getTitle
};
