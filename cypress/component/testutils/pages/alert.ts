import Chainable = Cypress.Chainable;

const getAlertMessage = (): Chainable<JQuery> =>
	cy.get('.MuiAlert-root .MuiAlert-message');

export const alertPage = {
	getAlertMessage
};
