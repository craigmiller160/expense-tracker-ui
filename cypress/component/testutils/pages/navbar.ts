type Chainable<T> = Cypress.Chainable<T>;

const getTitle = (): Chainable<JQuery> =>
	cy.get('#expense-tracker-navbar-title');
const getAuthButton = (): Chainable<JQuery> => cy.get('#navbar-auth-button');
const getNavbarItems = (): Chainable<JQuery> => cy.get('.navbar-item');
const getReportsItem = (): Chainable<JQuery> => getNavbarItems().eq(0);
const getTransactionsItem = (): Chainable<JQuery> => getNavbarItems().eq(1);
const getCategoriesItem = (): Chainable<JQuery> => getNavbarItems().eq(2);
const getRulesItem = (): Chainable<JQuery> => getNavbarItems().eq(3);
const getImportItem = (): Chainable<JQuery> => getNavbarItems().eq(4);
const getMobileNavItemsButton = (): Chainable<JQuery> =>
	cy.get('#navbar #mobile-nav-items-button');

export const navbarPage = {
	getTitle,
	getAuthButton,
	getNavbarItems,
	getReportsItem,
	getTransactionsItem,
	getCategoriesItem,
	getImportItem,
	getRulesItem,
	getMobileNavItemsButton
};
