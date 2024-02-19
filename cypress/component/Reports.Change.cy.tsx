import { categoriesApi } from './testutils/apis/categories';
import { reportsApi } from './testutils/apis/reports';
import { needsAttentionApi } from './testutils/apis/needsAttention';
import { mountApp } from './testutils/mountApp';
import { reportsPage } from './testutils/pages/reports';
import { reports } from './testutils/constants/reports';

describe('Reports.Change', () => {
	it('shows change between months when previous month has category', () => {
		categoriesApi.getUnknownCategory();
		reportsApi.getDefaultSpendingByMonthAndCategory();
		categoriesApi.getAllCategories();
		needsAttentionApi.getNeedsAttention_none();
		mountApp({
			initialRoute: '/reports'
		});
		reportsPage.getTitle().contains('Reports');
		reportsPage.getTableTitle().contains('Spending by Month & Category');
		reportsPage
			.getRootTableRows()
			.should('have.length', reports.reports.length);
		throw new Error();
	});

	it('shows change between months when previous month does not have category', () => {
		throw new Error();
	});

	it('shows change in total between months', () => {
		throw new Error();
	});

	it('shows N/A for change between months for the first month', () => {
		throw new Error();
	});
});
