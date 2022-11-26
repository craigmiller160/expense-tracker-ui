import Chainable = Cypress.Chainable;
import { pipe } from 'fp-ts/es6/function';
import { getInputForLabel } from './utils';

const getCategoryLabel = (): Chainable<JQuery> =>
	cy.get('.ReportFilters label').eq(0);
const getCategoryInput = (): Chainable<JQuery> =>
	pipe(getCategoryLabel(), getInputForLabel);

export const reportFiltersPage = {
	getCategoryLabel,
	getCategoryInput
};
