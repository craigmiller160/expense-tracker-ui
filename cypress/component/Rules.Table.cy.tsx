import { rulesApi } from './testutils/apis/rules';
import { mountApp } from './testutils/mountApp';
import { rulesListPage } from './testutils/pages/rulesList';
import { allRules, columnNames } from './testutils/constants/rules';
import { match } from 'ts-pattern';
import { pipe } from 'fp-ts/es6/function';
import * as Option from 'fp-ts/es6/Option';
import { serverDateToDisplayDate } from '../../src/utils/dateTimeUtils';
import { formatCurrency } from '../../src/utils/formatNumbers';
import { categoriesApi } from './testutils/apis/categories';

const formatDate = (value?: string): string =>
	pipe(
		Option.fromNullable(value),
		Option.map(serverDateToDisplayDate),
		Option.getOrElse(() => 'Any')
	);
const formatAmount = (value?: number): string =>
	pipe(
		Option.fromNullable(value),
		Option.map(formatCurrency),
		Option.getOrElse(() => 'Any')
	);

const validateRuleRow = (row: JQuery, index: number) => {
	rulesListPage
		.getOrdinalCell(cy.wrap(row))
		.should('have.text', allRules.rules[index].ordinal);
	rulesListPage
		.getCategoryCell(cy.wrap(row))
		.should('have.text', allRules.rules[index].categoryName);
	rulesListPage
		.getRuleCell(cy.wrap(row))
		.find('li')
		.each(($li, liIndex) => {
			const rule = allRules.rules[index];
			const expectedText = match(liIndex)
				.with(0, () => `Regex: /${rule.regex}/`)
				.with(
					1,
					() =>
						`Dates: ${formatDate(rule.startDate)} to ${formatDate(
							rule.endDate
						)}`
				)
				.with(
					2,
					() =>
						`Amounts: ${formatAmount(
							rule.minAmount
						)} to ${formatAmount(rule.maxAmount)}`
				)
				.run();
			expect($li.text()).eq(expectedText);
		});
};

describe('Rules Table', () => {
	it('shows the existing rules in the table', () => {
		rulesApi.getAllRules();
		categoriesApi.getAllCategories();
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

		rulesListPage.getAddRuleButton().should('have.text', 'Add Rule');
	});
});
