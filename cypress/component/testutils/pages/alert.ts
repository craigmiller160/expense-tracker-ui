type Chainable<T> = Cypress.Chainable<T>;

const getAlertMessage = (): Chainable<JQuery> =>
	cy.get('.MuiAlert-root .MuiAlert-message');

export const alertPage = {
	getAlertMessage
};
