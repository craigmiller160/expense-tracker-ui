import Chainable = Cypress.Chainable;

const getTitle = (): Chainable<JQuery> => cy.get('.Reports h4');
const getTableTitle = (): Chainable<JQuery> => cy.get('.Reports h6');
const getRootTableHeaders = (): Chainable<JQuery> =>
	cy.get('.Reports .ReportsTable-header th');
const getRootTableRows = (): Chainable<JQuery> => cy.get('.Reports .ReportsTable-body > tr');

export const reportsPage = {
	getTitle,
	getTableTitle,
	getRootTableHeaders,
	getRootTableRows
};