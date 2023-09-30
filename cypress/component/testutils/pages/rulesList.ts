import Chainable = Cypress.Chainable;

const getTitle = (): Chainable<JQuery> => cy.get('.auto-categorize-rules h4');
const getColumnHeaders = (): Chainable<JQuery> =>
	cy.get('.auto-categorize-rules .auto-categorize-rules-table th');
const getRuleRows = (): Chainable<JQuery> =>
	cy.get('.auto-categorize-rules .auto-categorize-rules-table tbody tr');
const getOrdinalCell = (row: Chainable<JQuery>): Chainable<JQuery> =>
	row.find('td').eq(0);
const getCategoryCell = (row: Chainable<JQuery>): Chainable<JQuery> =>
	row.find('td').eq(1);
const getRuleCell = (row: Chainable<JQuery>): Chainable<JQuery> =>
	row.find('td').eq(2);
const getDetailsButton = (row: Chainable<JQuery>): Chainable<JQuery> =>
	row.find('.RuleDetailsButton');
const getUpButton = (row: Chainable<JQuery>): Chainable<JQuery> =>
	row.find('.UpButton');
const getDownButton = (row: Chainable<JQuery>): Chainable<JQuery> =>
	row.find('.DownButton');
const getAddRuleButton = (): Chainable<JQuery> =>
	cy.get('.auto-categorize-rules #AddRuleBtn');

export const rulesListPage = {
	getTitle,
	getColumnHeaders,
	getRuleRows,
	getOrdinalCell,
	getCategoryCell,
	getRuleCell,
	getAddRuleButton,
	getDetailsButton,
	getUpButton,
	getDownButton
};
