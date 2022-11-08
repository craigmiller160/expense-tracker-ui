import Chainable = Cypress.Chainable;
import { pipe } from 'fp-ts/es6/function';
import { getInputForLabel } from './utils';

const getHeaderTitle = (): Chainable<JQuery> =>
	cy.get('#TransactionDetailsDialog-header .MuiToolbar-root h6');
const getContentTitle = (): Chainable<JQuery> =>
	cy.get('#TransactionDetailsDialog-body h6');
const getCloseButton = (): Chainable<JQuery> =>
	cy.get('#TransactionDetailsDialog-header .MuiToolbar-root button');
const getSaveButton = (): Chainable<JQuery> =>
	cy.get('#TransactionDetailsDialog-footer button:nth-of-type(1)');
const getDeleteButton = (): Chainable<JQuery> =>
	cy.get('#TransactionDetailsDialog-footer button:nth-of-type(2)');
const getConfirmCheckboxLabel = (): Chainable<JQuery> =>
	cy.get('#TransactionDetailsDialog-body .Controls label:nth-of-type(1)');
const getConfirmCheckboxInput = (): Chainable<JQuery> =>
	pipe(getConfirmCheckboxLabel(), getInputForLabel);
const getCategorySelectLabel = (): Chainable<JQuery> =>
	cy.get('#TransactionDetailsDialog-body .Controls label:nth-of-type(2)');
const getExpenseDateLabel = (): Chainable<JQuery> =>
	cy.get('#TransactionDetailsDialog-body .Info label:nth-of-type(1)');
const getAmountLabel = (): Chainable<JQuery> =>
	cy.get('#TransactionDetailsDialog-body .Info label:nth-of-type(2)');
const getDescriptionLabel = (): Chainable<JQuery> =>
	cy.get('#TransactionDetailsDialog-body .Info label:nth-of-type(3)');

export const transactionDetailsPage = {
	getHeaderTitle,
	getContentTitle,
	getCloseButton,
	getSaveButton,
	getDeleteButton,
	getConfirmCheckboxLabel,
	getCategorySelectLabel,
	getConfirmCheckboxInput,
	getExpenseDateLabel,
	getAmountLabel,
	getDescriptionLabel
};
