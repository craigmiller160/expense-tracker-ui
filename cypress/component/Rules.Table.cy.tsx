import { rulesApi } from './testutils/apis/rules';
import { mountApp } from './testutils/mountApp';
import { rulesListPage } from './testutils/pages/rulesList';
import { allRules, columnNames } from './testutils/constants/rules';

const validateRuleRow = (row: JQuery, index: number) => {
	rulesListPage
		.getOrdinalCell(cy.wrap(row))
		.should('have.text', allRules.rules[index].ordinal);
	rulesListPage
		.getCategoryCell(cy.wrap(row))
		.should('have.text', allRules.rules[index].categoryName);
};

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
		rulesListPage
			.getRuleRows()
			.should('have.length', allRules.rules.length)
			.each(($row, index) => validateRuleRow($row, index));
	});
});
