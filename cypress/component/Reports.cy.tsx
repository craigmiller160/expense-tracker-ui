import { reportsApi } from './testutils/apis/reports';
import { mountApp } from './testutils/mountApp';
import { reportsPage } from './testutils/pages/reports';
import { reportRootTableHeaders, reports } from './testutils/constants/reports';
import * as RNonEmptyArray from 'fp-ts/es6/ReadonlyNonEmptyArray';
import { pipe } from 'fp-ts/es6/function';
import { formatCurrency, formatPercent } from '../../src/utils/formatNumbers';
import { categoriesApi } from './testutils/apis/categories';
import { needsAttentionApi } from './testutils/apis/needsAttention';

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

const validateReport = (reportRowIndex: number) => {
	const report = reports.reports[reportRowIndex];
	reportsPage.getReportChart(reportRowIndex).should('be.visible');
	reportsPage
		.getReportTableRows(reportRowIndex)
		.should('have.length', report.categories.length + 1);
	pipe(
		RNonEmptyArray.range(0, report.categories.length - 1),
		RNonEmptyArray.map((index) => {
			const getReportTableCells = () =>
				reportsPage
					.getReportTableRows(reportRowIndex)
					.eq(index)
					.find('td');
			getReportTableCells().eq(1).contains(report.categories[index].name);
			getReportTableCells()
				.eq(2)
				.contains(formatCurrency(report.categories[index].amount));
			getReportTableCells()
				.eq(3)
				.contains(formatPercent(report.categories[index].percent));
		})
	);
	const getTotalCells = () =>
		reportsPage
			.getReportTableRows(reportRowIndex)
			.eq(report.categories.length)
			.find('td');
	getTotalCells().eq(1).contains('Total');
	getTotalCells().eq(2).contains(formatCurrency(report.total));
};

describe('Reports', () => {
	it('shows month-by-month report', () => {
		reportsApi.getSpendingByMonthAndCategory();
		categoriesApi.getAllCategories();
		needsAttentionApi.getNeedsAttention_none();
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

	it('can exclude a category', () => {
		reportsApi.getSpendingByMonthAndCategory();
		categoriesApi.getAllCategories();
		needsAttentionApi.getNeedsAttention_none();
		mountApp({
			initialRoute: '/expense-tracker/reports'
		});
		reportsPage.getTitle().contains('Reports');
		reportsPage.getTableTitle().contains('Spending by Month & Category');
		reportsPage
			.getCategoryFilterLabel()
			.should('have.text', 'Excluded Categories');
	});
});
