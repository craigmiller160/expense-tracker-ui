import Chainable = Cypress.Chainable;

const getTitle = (): Chainable<JQuery> => cy.get('.Reports h4');
const getTableTitle = (): Chainable<JQuery> => cy.get('.Reports h6');
const getRootTableHeaders = (): Chainable<JQuery> =>
	cy.get('.Reports .ReportsTable-header th');
const getRootTableRows = (): Chainable<JQuery> =>
	cy.get('.Reports .ReportsTable-body > tr');
const getReportTable = (rowIndex: number): Chainable<JQuery> =>
	getRootTableRows().eq(rowIndex).find('.SpendingByCategoryTable');
const getReportChart = (rowIndex: number): Chainable<JQuery> =>
	getRootTableRows().eq(rowIndex).find('.SpendingByCategoryChart');
const getReportTableRows = (tableRowIndex: number): Chainable<JQuery> =>
	getReportTable(tableRowIndex).find('tbody tr');
const getReportTableCategories = (tableIndex: number) =>
	getReportTableRows(tableIndex).find('td:nth-child(2)');

export const reportsPage = {
	getTitle,
	getTableTitle,
	getRootTableHeaders,
	getRootTableRows,
	getReportTable,
	getReportChart,
	getReportTableRows,
	getReportTableCategories
};
