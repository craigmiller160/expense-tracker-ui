import { reportsApi } from './testutils/apis/reports';
import { mountApp } from './testutils/mountApp';
import { reportsPage } from './testutils/pages/reports';
import { reportRootTableHeaders } from './testutils/constants/reports';

const validateTableHeaders = () => {
	reportsPage
		.getRootTableHeaders()
		.should('have.length', reportRootTableHeaders.length);
	reportsPage
		.getRootTableHeaders()
		.each(($elem, index) =>
			expect($elem.text()).eq(reportRootTableHeaders[index])
		);
};

describe('Reports', () => {
	it('shows month-by-month report', () => {
		reportsApi.getSpendingByMonthAndCategory();
		mountApp({
			initialRoute: '/expense-tracker/reports'
		});
		reportsPage.getTitle().contains('Reports');
		reportsPage.getTableTitle().contains('Spending by Month & Category');
		validateTableHeaders();
	});
});
