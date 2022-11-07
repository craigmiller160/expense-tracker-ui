import Chainable = Cypress.Chainable;

const getTitle = (): Chainable<JQuery> =>
	cy.get('#expense-tracker-navbar-title');
const getAuthButton = (): Chainable<JQuery> => cy.get('#navbar-auth-button');
const getNavbarItems = (): Chainable<JQuery> => cy.get('#navbar .LinkButton');

export const navbarPage = {
	getTitle,
	getAuthButton,
	getNavbarItems
};
