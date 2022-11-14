import { reportsApi } from './testutils/apis/reports';
import { mountApp } from './testutils/mountApp';
import { reportsPage } from './testutils/pages/reports';
import { reportRootTableHeaders, reports } from './testutils/constants/reports';

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

const validateReport = (index: number) => {};

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
	});
});
