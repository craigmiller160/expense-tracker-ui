import { pipe } from 'fp-ts/function';
import { getInputForLabel } from './utils';

type Chainable<T> = Cypress.Chainable<T>;

const getRegexFilterLabel = (): Chainable<JQuery> =>
	cy.get('.auto-categorize-rules-filters label').eq(0);
const getCategoryFilterLabel = (): Chainable<JQuery> =>
	cy.get('.auto-categorize-rules-filters label').eq(1);
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
