import { reportsApi } from './testutils/apis/reports';
import { mountApp } from './testutils/mountApp';
import { reportsPage } from './testutils/pages/reports';
import { reportRootTableHeaders, reports } from './testutils/constants/reports';
import * as RNonEmptyArray from 'fp-ts/es6/ReadonlyNonEmptyArray';
import { pipe } from 'fp-ts/es6/function';
import { formatCurrency, formatPercent } from '../../src/utils/formatNumbers';

const validateRootTableHeaders = () => {
	reportsPage
		.getRootTableHeaders()
		.should('have.length', reportRootTableHeaders.length);
	reportsPage
		.getRootTableHeaders()
		.each(($elem, index) =>
			expect($elem.text()).eq(reportRootTableHeaders[index])
		);
};

const validateReport = (index: number) => {
	const report = reports.reports[index];
	reportsPage.getReportChart(index).should('be.visible');
	reportsPage
		.getReportTableRows(index)
		.should('have.length', report.categories.length + 1);
	pipe(
		RNonEmptyArray.range(0, report.categories.length - 1),
		RNonEmptyArray.map((index) => {
			const reportTableCells = reportsPage
				.getReportTableRows(index)
				.eq(index)
				.find('td');
			reportTableCells.eq(1).contains(report.categories[index].name);
			reportTableCells
				.eq(2)
				.contains(formatCurrency(report.categories[index].amount));
			reportTableCells
				.eq(2)
				.contains(formatPercent(report.categories[index].percent));
		})
	);
	const totalCells = reportsPage
		.getReportTableRows(index)
		.eq(report.categories.length)
		.find('td');
	totalCells.eq(1).contains('Total');
	totalCells.eq(2).contains(formatCurrency(report.total));
};

describe('Reports', () => {
	it('shows month-by-month report', () => {
		reportsApi.getSpendingByMonthAndCategory();
		mountApp({
			initialRoute: '/expense-tracker/reports'
		});
		reportsPage.getTitle().contains('Reports');
		reportsPage.getTableTitle().contains('Spending by Month & Category');
		validateRootTableHeaders();
		reportsPage
			.getRootTableRows()
			.should('have.length', reports.reports.length);
		pipe(
			RNonEmptyArray.range(0, reports.reports.length - 1),
			RNonEmptyArray.map(validateReport)
		);
	});
});
