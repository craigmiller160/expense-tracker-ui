type Chainable<T> = Cypress.Chainable<T>;

const getTitle = (): Chainable<JQuery> => cy.get('.reports h4');
const getTableTitle = (): Chainable<JQuery> => cy.get('.reports h6');
const getRootTableHeaders = (): Chainable<JQuery> =>
	cy.get('.reports .reports-table-header th');
const getRootTableRows = (): Chainable<JQuery> =>
	cy.get('.reports .reports-table-body > tr');
const getReportTable = (rowIndex: number): Chainable<JQuery> =>
	getRootTableRows().eq(rowIndex).find('.SpendingByCategoryTable');
const getReportChart = (rowIndex: number): Chainable<JQuery> =>
	getRootTableRows().eq(rowIndex).find('.spending-by-category-chart');
const getReportTableRows = (tableRowIndex: number): Chainable<JQuery> =>
	getReportTable(tableRowIndex).find('tbody tr');
const getReportTableCategories = (tableIndex: number): Chainable<JQuery> =>
	getReportTableRows(tableIndex).find('td:nth-child(2) a');
const getReportTableDate = (tableIndex: number): Chainable<JQuery> =>
	getRootTableRows().eq(tableIndex).find('td a').eq(0);

export const reportsPage = {
	getTitle,
	getTableTitle,
	getRootTableHeaders,
	getRootTableRows,
	getReportTable,
	getReportChart,
	getReportTableRows,
	getReportTableCategories,
	getReportTableDate
};
