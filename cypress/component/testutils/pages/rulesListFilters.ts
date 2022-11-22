import Chainable = Cypress.Chainable;

const getRegexFilterLabel = (): Chainable<JQuery> =>
	cy.get('.AutoCategorizeRulesFilters label').eq(0);
const getCategoryFilterLabel = (): Chainable<JQuery> =>
	cy.get('.AutoCategorizeRulesFilters label').eq(1);

export const rulesListFiltersPage = {
	getRegexFilterLabel,
	getCategoryFilterLabel
};
