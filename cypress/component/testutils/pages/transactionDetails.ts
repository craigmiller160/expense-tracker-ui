import Chainable = Cypress.Chainable;

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
	getConfirmCheckboxLabel()
		.invoke('attr', 'for')
		.then((forValue) => cy.get(`[id="${forValue}"]`));
const getCategorySelectLabel = (): Chainable<JQuery> =>
	cy.get('#TransactionDetailsDialog-body .Controls label:nth-of-type(2)');

export const transactionDetailsPage = {
	getHeaderTitle,
	getContentTitle,
	getCloseButton,
	getSaveButton,
	getDeleteButton,
	getConfirmCheckboxLabel,
	getCategorySelectLabel,
	getConfirmCheckboxInput
};
