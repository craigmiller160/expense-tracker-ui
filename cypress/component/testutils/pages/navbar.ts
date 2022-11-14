import Chainable = Cypress.Chainable;

const getTitle = (): Chainable<JQuery> =>
	cy.get('#expense-tracker-navbar-title');
const getAuthButton = (): Chainable<JQuery> => cy.get('#navbar-auth-button');
const getNavbarItems = (): Chainable<JQuery> => cy.get('#navbar .LinkButton');
const getReportsItem = (): Chainable<JQuery> =>
	cy.get('#navbar .LinkButton').eq(0);
const getTransactionsItem = (): Chainable<JQuery> =>
	cy.get('#navbar .LinkButton').eq(1);
const getCategoriesItem = (): Chainable<JQuery> =>
	cy.get('#navbar .LinkButton').eq(2);
const getImportItem = (): Chainable<JQuery> =>
	cy.get('#navbar .LinkButton').eq(3);

export const navbarPage = {
	getTitle,
	getAuthButton,
	getNavbarItems,
	getReportsItem,
	getTransactionsItem,
	getCategoriesItem,
	getImportItem
};
