import Chainable = Cypress.Chainable;

const getHeaderTitle = (): Chainable<JQuery> =>
	cy.get('#CategoryDetailsDialog .MuiToolbar-root h6');
const getContentTitle = (): Chainable<JQuery> =>
	cy.get('#CategoryDetailsDialog .MuiDialogContent-root h6');

export const categoryDetailsPage = {
	getHeaderTitle,
	getContentTitle
};
