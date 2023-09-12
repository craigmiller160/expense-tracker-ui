import Chainable = Cypress.Chainable;
import { pipe } from 'fp-ts/function';
import { getHelperTextForLabel, getInputForLabel } from './utils';

const getHeaderTitle = (): Chainable<JQuery> =>
	cy.get('#CategoryDetailsDialog-header .MuiToolbar-root h6');
const getContentTitle = (): Chainable<JQuery> =>
	cy.get('#CategoryDetailsDialog-body h6');
const getCategoryNameLabel = (): Chainable<JQuery> =>
	cy.get('#CategoryDetailsDialog-body label').eq(0);
const getCategoryNameInput = (): Chainable<JQuery> =>
	pipe(getCategoryNameLabel(), getInputForLabel);
const getCategoryNameInputHelperText = (): Chainable<JQuery> =>
	pipe(getCategoryNameLabel(), getHelperTextForLabel);
const getCloseButton = (): Chainable<JQuery> =>
	cy.get('#CategoryDetailsDialog-header .MuiToolbar-root button');
const getSaveButton = (): Chainable<JQuery> =>
	cy.get('#CategoryDetailsDialog-footer button:nth-of-type(1)');
const getDeleteButton = (): Chainable<JQuery> =>
	cy.get('#CategoryDetailsDialog-footer button:nth-of-type(2)');

export const categoryDetailsPage = {
	getHeaderTitle,
	getContentTitle,
	getCategoryNameLabel,
	getCategoryNameInput,
	getCategoryNameInputHelperText,
	getCloseButton,
	getSaveButton,
	getDeleteButton
};
