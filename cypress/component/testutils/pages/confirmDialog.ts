import Chainable = Cypress.Chainable;

const getTitle = (): Chainable<JQuery> => cy.get('#ConfirmDialog h2');
const getMessage = (): Chainable<JQuery> =>
	cy.get('#ConfirmDialog div.MuiDialogContent-root');
const getCancelButton = (): Chainable<JQuery> =>
	cy.get('#ConfirmDialog .MuiDialogActions-root button:nth-of-type(1)');
const getConfirmButton = (): Chainable<JQuery> =>
	cy.get('#ConfirmDialog .MuiDialogActions-root button:nth-of-type(2)');

export const confirmDialog = {
	getTitle,
	getMessage,
	getCancelButton,
	getConfirmButton
};
