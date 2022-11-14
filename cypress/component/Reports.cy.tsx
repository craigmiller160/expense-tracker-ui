import { reportsApi } from './testutils/apis/reports';
import { mountApp } from './testutils/mountApp';
import { reportsPage } from './testutils/pages/reports';
import { reportRootTableHeaders, reports } from './testutils/constants/reports';
import * as RNonEmptyArray from 'fp-ts/es6/ReadonlyNonEmptyArray';
import { pipe } from 'fp-ts/es6/function';

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
	const row = reportsPage.getRootTableRows().eq(index);
	const report = reports.reports[index];
	reportsPage.getReportChart(row).should('be.visible');
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
			RNonEmptyArray.range(0, reports.reports.length),
			RNonEmptyArray.map(validateReport)
		);
	});
});
