import Chainable = Cypress.Chainable;
import { pipe } from 'fp-ts/es6/function';
import { getInputForLabel } from './utils';

const getRegexFilterLabel = (): Chainable<JQuery> =>
	cy.get('.AutoCategorizeRulesFilters label').eq(0);
const getCategoryFilterLabel = (): Chainable<JQuery> =>
	cy.get('.AutoCategorizeRulesFilters label').eq(1);
const getRegexFilterInput = (): Chainable<JQuery> =>
	pipe(getRegexFilterLabel(), getInputForLabel);
const getCategoryFilterInput = (): Chainable<JQuery> =>
	pipe(getCategoryFilterLabel(), getInputForLabel);
const getResetFilterButton = (): Chainable<JQuery> =>
	cy.get('#rulesFilterResetButton');

export const rulesListFiltersPage = {
	getRegexFilterLabel,
	getCategoryFilterLabel,
	getRegexFilterInput,
	getCategoryFilterInput,
	getResetFilterButton
};
