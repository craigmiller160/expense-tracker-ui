import { rulesApi } from './testutils/apis/rules';
import { mountApp } from './testutils/mountApp';
import { rulesListPage } from './testutils/pages/rulesList';
import { columnNames } from './testutils/constants/rules';

describe('Rules Table', () => {
	it('shows the existing rules in the table', () => {
		rulesApi.getAllRules();
		mountApp({
			initialRoute: '/expense-tracker/rules'
		});

		rulesListPage.getTitle().contains('Auto-Categorization Rules');
		rulesListPage
			.getColumnHeaders()
			.each(($header, index) =>
				expect($header.text()).eq(columnNames[index])
			);
	});
});
