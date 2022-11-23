import { rulesApi } from './testutils/apis/rules';
import { categoriesApi } from './testutils/apis/categories';
import { allRules } from './testutils/constants/rules';
import { mountApp } from './testutils/mountApp';
import { rulesListPage } from './testutils/pages/rulesList';
import { ruleDetailsPage } from './testutils/pages/ruleDetails';

type RuleValues = {
	readonly categoryName: string;
	readonly ordinal: number;
	readonly regex: string;
	readonly minAmount?: string;
	readonly maxAmount?: string;
	readonly startDate?: string;
	readonly endDate?: string;
};

const validateRuleDialogFields = (values: RuleValues) => {
	ruleDetailsPage.getOrdinalLabel().should('have.text', 'Ordinal');
	ruleDetailsPage.getOrdinalInput().should('have.value', values.ordinal);
	ruleDetailsPage.getCategoryLabel().should('have.text', 'Category');
	ruleDetailsPage
		.getCategoryInput()
		.should('have.value', values.categoryName);
	ruleDetailsPage.getRegexLabel().should('have.text', 'Regex');
	ruleDetailsPage.getRegexInput().should('have.value', values.regex);

	ruleDetailsPage.getMinAmountLabel().should('have.text', 'Min Amount ($)');
	ruleDetailsPage
		.getMinAmountInput()
		.should('have.value', values.minAmount ?? '');
	ruleDetailsPage.getMaxAmountLabel().should('have.text', 'Max Amount ($)');
	ruleDetailsPage
		.getMaxAmountInput()
		.should('have.value', values.maxAmount ?? '');
};

describe('Rule Details', () => {
	it('opens existing rule with minimum fields filled', () => {
		const ruleId = allRules.rules[0].id;
		rulesApi.getAllRules();
		categoriesApi.getAllCategories();
		rulesApi.getMaxOrdinal();
		rulesApi.getRule_minimum(ruleId);
		mountApp({
			initialRoute: '/expense-tracker/rules'
		});

		const row = rulesListPage.getRuleRows().eq(0);
		rulesListPage.getDetailsButton(row).click();

		ruleDetailsPage.getHeaderTitle().should('have.text', 'Rule Details');
		validateRuleDialogFields({
			ordinal: 1,
			categoryName: 'Groceries',
			regex: 'TARGET'
		});
	});

	it('opens existing rule with maximum fields filled', () => {
		throw new Error();
	});

	it('can add a new rule', () => {
		throw new Error();
	});

	it('can update an existing rule', () => {
		throw new Error();
	});

	it('input validation rules', () => {
		throw new Error();
	});

	it('can delete an existing rule', () => {
		throw new Error();
	});
});
