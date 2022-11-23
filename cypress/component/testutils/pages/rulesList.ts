import Chainable = Cypress.Chainable;

const getTitle = (): Chainable<JQuery> => cy.get('.AutoCategorizeRules h4');
const getColumnHeaders = (): Chainable<JQuery> =>
	cy.get('.AutoCategorizeRules .AutoCategorizeRulesTable th');
const getRuleRows = (): Chainable<JQuery> =>
	cy.get('.AutoCategorizeRules .AutoCategorizeRulesTable tbody tr');
const getOrdinalCell = (row: Chainable<JQuery>): Chainable<JQuery> =>
	row.find('td').eq(0);
const getCategoryCell = (row: Chainable<JQuery>): Chainable<JQuery> =>
	row.find('td').eq(1);
const getRuleCell = (row: Chainable<JQuery>): Chainable<JQuery> =>
	row.find('td').eq(2);

export const rulesListPage = {
	getTitle,
	getColumnHeaders,
	getRuleRows,
	getOrdinalCell,
	getCategoryCell,
	getRuleCell
};
