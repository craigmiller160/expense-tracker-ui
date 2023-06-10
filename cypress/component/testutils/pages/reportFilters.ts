import Chainable = Cypress.Chainable;
import { pipe } from 'fp-ts/es6/function';
import { getInputForLabel } from './utils';

const getFilterTypeLabel = (): Chainable<JQuery> =>
	cy.get('.ReportFilters label').eq(0);
const getFilterTypeInput = (): Chainable<JQuery> =>
	pipe(getFilterTypeLabel(), getInputForLabel);

const getCategoryLabel = (): Chainable<JQuery> =>
	cy.get('.ReportFilters label').eq(1);
const getCategoryInput = (): Chainable<JQuery> =>
	pipe(getCategoryLabel(), getInputForLabel);

export const reportFiltersPage = {
	getCategoryLabel,
	getCategoryInput,
	getFilterTypeLabel,
	getFilterTypeInput
};
