import { reportsApi } from './testutils/apis/reports';
import { mountApp } from './testutils/mountApp';
import { reportsPage } from './testutils/pages/reports';
import { reportRootTableHeaders, reports } from './testutils/constants/reports';
import * as RNonEmptyArray from 'fp-ts/ReadonlyNonEmptyArray';
import { pipe } from 'fp-ts/function';
import { formatCurrency, formatPercent } from '../../src/utils/formatNumbers';
import { categoriesApi } from './testutils/apis/categories';
import { needsAttentionApi } from './testutils/apis/needsAttention';
import { transactionsApi } from './testutils/apis/transactions';
import { transactionFilters } from './testutils/pages/transactionFilters';

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
	it('clicking on category opens page of related transactions', () => {
		categoriesApi.getUnknownCategory();
		reportsApi.getDefaultSpendingByMonthAndCategory();
		categoriesApi.getAllCategories();
		needsAttentionApi.getNeedsAttention_none();
		transactionsApi.searchForTransactions();
		mountApp({
			initialRoute: '/reports'
		});

		reportsPage
			.getReportTableCategories(0)
			.eq(0)
			.should('have.text', 'Entertainment');
		reportsPage.getReportTableCategories(0).eq(0).click();

		transactionFilters
			.getStartDateInput()
			.should('have.value', '11/01/2022');
		transactionFilters.getEndDateInput().should('have.value', '11/30/2022');
		transactionFilters.getCategorizedInput().should('have.value', 'ALL');
		transactionFilters
			.getCategoryInput()
			.should('have.value', 'Entertainment');
	});

	it('clicking on unknown category opens page of uncategorized transactions', () => {
		categoriesApi.getUnknownCategory();
		reportsApi.getDefaultSpendingByMonthAndCategory();
		categoriesApi.getAllCategories();
		needsAttentionApi.getNeedsAttention_none();
		transactionsApi.searchForTransactions();
		mountApp({
			initialRoute: '/reports'
		});

		reportsPage
			.getReportTableCategories(0)
			.eq(4)
			.should('have.text', 'Unknown');
		reportsPage.getReportTableCategories(0).eq(4).click();

		transactionFilters
			.getStartDateInput()
			.should('have.value', '11/01/2022');
		transactionFilters.getEndDateInput().should('have.value', '11/30/2022');
		transactionFilters.getCategorizedInput().should('have.value', 'NO');
		transactionFilters.getCategoryInput().should('have.value', '');
	});

	it('clicking on month opens page of related transactions', () => {
		categoriesApi.getUnknownCategory();
		reportsApi.getDefaultSpendingByMonthAndCategory();
		categoriesApi.getAllCategories();
		needsAttentionApi.getNeedsAttention_none();
		transactionsApi.searchForTransactions();
		mountApp({
			initialRoute: '/reports'
		});

		reportsPage.getReportTableDate(0).should('have.text', 'Nov 2022');
		reportsPage.getReportTableDate(0).click();

		transactionFilters
			.getStartDateInput()
			.should('have.value', '11/01/2022');
		transactionFilters.getEndDateInput().should('have.value', '11/30/2022');
		transactionFilters.getCategorizedInput().should('have.value', 'ALL');
		transactionFilters.getCategoryInput().should('have.value', '');
	});

	it('shows month-by-month report', () => {
		categoriesApi.getUnknownCategory();
		reportsApi.getDefaultSpendingByMonthAndCategory();
		categoriesApi.getAllCategories();
		needsAttentionApi.getNeedsAttention_none();
		mountApp({
			initialRoute: '/reports'
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
