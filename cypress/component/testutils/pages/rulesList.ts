import Chainable = Cypress.Chainable;

const getTitle = (): Chainable<JQuery> => cy.get('.AutoCategorizeRules h4');
const getColumnHeaders = (): Chainable<JQuery> =>
	cy.get('.AutoCategorizeRules .AutoCategorizeRulesTable th');

export const rulesListPage = {
	getTitle,
	getColumnHeaders
};
