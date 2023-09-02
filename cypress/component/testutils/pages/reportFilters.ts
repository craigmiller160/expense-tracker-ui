import Chainable = Cypress.Chainable;
import { pipe } from 'fp-ts/function';
import { getInputForLabel } from './utils';

const getFilterTypeLabel = (): Chainable<JQuery> =>
	cy.get('.ReportFilters label').eq(0);
const getFilterTypeInput = (): Chainable<JQuery> =>
	pipe(getFilterTypeLabel(), getInputForLabel);

const getCategoryLabel = (): Chainable<JQuery> =>
	cy.get('.ReportFilters label').eq(1);
const getCategoryInput = (): Chainable<JQuery> =>
	pipe(getCategoryLabel(), getInputForLabel);
const getOrderCategoriesByInput = (): Chainable<JQuery> =>
	cy.get('#reportOrderCategoriesBy');
const getOrderCategoriesByInputWrapper = (): Chainable<JQuery> =>
	cy.get('#reportOrderCategoriesBy-wrapper');
const getOrderCategoriesByLabel = (): Chainable<JQuery> =>
	cy.get('#reportOrderCategoriesBy-label');
const getResetFiltersButton = (): Chainable<JQuery> =>
	cy.get('#reportFilterResetButton');

export const reportFiltersPage = {
	getCategoryLabel,
	getCategoryInput,
	getFilterTypeLabel,
	getFilterTypeInput,
	getOrderCategoriesByInput,
	getOrderCategoriesByLabel,
	getOrderCategoriesByInputWrapper,
	getResetFiltersButton
};
