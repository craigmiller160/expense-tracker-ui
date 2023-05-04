import Chainable = Cypress.Chainable;
import { getInputForLabel } from './utils';
import { pipe } from 'fp-ts/es6/function';

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

const getCategoryFilterLabel = (): Chainable<JQuery> =>
	cy.get('.ReportFilters .MuiAutocomplete-root label').eq(0);
const getCategoryFilterInput = (): Chainable<JQuery> =>
	pipe(getCategoryFilterLabel(), getInputForLabel);

export const reportsPage = {
	getTitle,
	getTableTitle,
	getRootTableHeaders,
	getRootTableRows,
	getReportTable,
	getReportChart,
	getReportTableRows,
	getCategoryFilterLabel,
	getCategoryFilterInput
};
