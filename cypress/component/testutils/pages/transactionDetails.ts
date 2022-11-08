import Chainable = Cypress.Chainable;
import { pipe } from 'fp-ts/es6/function';
import { getHelperTextForLabel, getInputForLabel } from './utils';

const getHeaderTitle = (): Chainable<JQuery> =>
	cy.get('#TransactionDetailsDialog-header .MuiToolbar-root h6');
const getContentTitle = (): Chainable<JQuery> =>
	cy.get('#TransactionDetailsDialog-body h6');
const getCloseButton = (): Chainable<JQuery> =>
	cy.get('#TransactionDetailsDialog-header .MuiToolbar-root button');
const getSaveButton = (): Chainable<JQuery> =>
	cy.get('#TransactionDetailsDialog-footer button').eq(0);
const getDeleteButton = (): Chainable<JQuery> =>
	cy.get('#TransactionDetailsDialog-footer button').eq(1);
const getConfirmCheckboxLabel = (): Chainable<JQuery> =>
	cy.get('#TransactionDetailsDialog-body .Controls label:nth-of-type(1)');
const getConfirmCheckboxInput = (): Chainable<JQuery> =>
	pipe(getConfirmCheckboxLabel(), getInputForLabel);
const getCategorySelectLabel = (): Chainable<JQuery> =>
	cy.get('#TransactionDetailsDialog-body .Controls label:nth-of-type(2)');
const getExpenseDateLabel = (): Chainable<JQuery> =>
	cy.get('#TransactionDetailsDialog-body .Info label').eq(0);
const getExpenseDateInput = (): Chainable<JQuery> =>
	pipe(getExpenseDateLabel(), getInputForLabel);
const getExpenseDateInputHelperText = (): Chainable<JQuery> =>
	pipe(getExpenseDateLabel(), getHelperTextForLabel);
const getAmountLabel = (): Chainable<JQuery> =>
	cy.get('#TransactionDetailsDialog-body .Info label').eq(1);
const getAmountInput = (): Chainable<JQuery> =>
	pipe(getAmountLabel(), getInputForLabel);
const getAmountInputHelperText = (): Chainable<JQuery> =>
	pipe(getAmountLabel(), getHelperTextForLabel);
const getDescriptionLabel = (): Chainable<JQuery> =>
	cy.get('#TransactionDetailsDialog-body .Info label').eq(2);
const getDescriptionInput = (): Chainable<JQuery> =>
	pipe(getDescriptionLabel(), getInputForLabel);
const getDescriptionHelperText = (): Chainable<JQuery> =>
	pipe(getDescriptionLabel(), getHelperTextForLabel);
const getDuplicateIcon = (): Chainable<JQuery> =>
	cy.get('#TransactionDetailsDialog-body [data-testid="duplicate-icon"]');
const getNotCategorizedIcon = (): Chainable<JQuery> =>
	cy.get('#TransactionDetailsDialog-body [data-testid="no-category-icon"]');
const getNotConfirmedIcon = (): Chainable<JQuery> =>
	cy.get('#TransactionDetailsDialog-body [data-testid="not-confirmed-icon"]');
const getPossibleRefundIcon = (): Chainable<JQuery> =>
	cy.get(
		'#TransactionDetailsDialog-body [data-testid="possible-refund-icon"]'
	);
const getCreatedTimestamp = (): Chainable<JQuery> =>
	cy.get('#TransactionDetailsDialog-body .Timestamps span').eq(0);
const getUpdatedTimestamp = (): Chainable<JQuery> =>
	cy.get('#TransactionDetailsDialog-body .Timestamps span').eq(1);
const getDuplicateCreatedTimestamps = (): Chainable<JQuery> =>
	cy.get('.TransactionDetailsDuplicatePanel tbody td').eq(0);
const getDuplicateUpdatedTimestamps = (): Chainable<JQuery> =>
	cy.get('.TransactionDetailsDuplicatePanel tbody td').eq(1);
const getDuplicateCategories = (): Chainable<JQuery> =>
	cy.get('.TransactionDetailsDuplicatePanel tbody td').eq(2);
const getDuplicateOpenButtons = (): Chainable<JQuery> =>
	cy.get('.TransactionDetailsDuplicatePanel tbody td button');
const getDuplicateTitle = (): Chainable<JQuery> =>
	cy.get('.TransactionDetailsDuplicatePanel h5');

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
	getDescriptionLabel,
	getExpenseDateInput,
	getExpenseDateInputHelperText,
	getAmountInput,
	getAmountInputHelperText,
	getDescriptionInput,
	getDescriptionHelperText,
	getDuplicateIcon,
	getNotCategorizedIcon,
	getNotConfirmedIcon,
	getPossibleRefundIcon,
	getCreatedTimestamp,
	getUpdatedTimestamp,
	getDuplicateCreatedTimestamps,
	getDuplicateUpdatedTimestamps,
	getDuplicateCategories,
	getDuplicateOpenButtons,
	getDuplicateTitle
};
