import { rulesApi } from './testutils/apis/rules';
import { categoriesApi } from './testutils/apis/categories';
import { allRules } from './testutils/constants/rules';
import { mountApp } from './testutils/mountApp';
import { rulesListPage } from './testutils/pages/rulesList';
import { ruleDetailsPage } from './testutils/pages/ruleDetails';
import { commonPage } from './testutils/pages/common';
import {
	orderedCategoryIds,
	orderedCategoryNames
} from './testutils/constants/categories';
import { confirmDialogPage } from './testutils/pages/confirmDialog';
import { validateInputRules } from './testutils/validations/inputRules';

type RuleValues = {
	readonly categoryName: string;
	readonly ordinal: number;
	readonly regex: string;
	readonly minAmount?: string;
	readonly maxAmount?: string;
	readonly startDate?: string;
	readonly endDate?: string;
};

const validateRuleDialogFields = (values: RuleValues, isCreate = false) => {
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

	ruleDetailsPage.getSaveButton().should('have.text', 'Save');
	if (!isCreate) {
		ruleDetailsPage.getDeleteButton().should('have.text', 'Delete');
	} else {
		ruleDetailsPage.getDeleteButton().should('not.exist');
	}
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
		const ruleId = allRules.rules[0].id;
		rulesApi.getAllRules();
		categoriesApi.getAllCategories();
		rulesApi.getMaxOrdinal();
		rulesApi.getRule_maximum(ruleId);
		mountApp({
			initialRoute: '/expense-tracker/rules'
		});

		const row = rulesListPage.getRuleRows().eq(0);
		rulesListPage.getDetailsButton(row).click();

		ruleDetailsPage.getHeaderTitle().should('have.text', 'Rule Details');
		validateRuleDialogFields({
			ordinal: 1,
			categoryName: 'Groceries',
			regex: 'TARGET',
			minAmount: '1.00',
			maxAmount: '2.00',
			startDate: '01/01/2022',
			endDate: '02/02/2022'
		});
	});

	it('can add a new rule with maximum values', () => {
		rulesApi.getAllRules();
		categoriesApi.getAllCategories();
		rulesApi.getMaxOrdinal();
		rulesApi.createRule();
		mountApp({
			initialRoute: '/expense-tracker/rules'
		});

		rulesListPage.getAddRuleButton().click();
		ruleDetailsPage.getHeaderTitle().should('have.text', 'Rule Details');
		validateRuleDialogFields(
			{
				ordinal: 5,
				categoryName: '',
				regex: ''
			},
			true
		);
		ruleDetailsPage.getSaveButton().should('be.disabled');

		ruleDetailsPage.getCategoryInput().click();
		commonPage.getOpenSelectOptions().eq(0).click();
		ruleDetailsPage
			.getCategoryInput()
			.should('have.value', orderedCategoryNames[0]);

		ruleDetailsPage
			.getRegexInput()
			.type('Hello')
			.should('have.value', 'Hello');
		ruleDetailsPage
			.getMinAmountInput()
			.type('1.00')
			.should('have.value', '1.00');
		ruleDetailsPage
			.getMaxAmountInput()
			.type('2.00')
			.should('have.value', '2.00');
		ruleDetailsPage
			.getStartDateInput()
			.type('01/01/2022')
			.should('have.value', '01/01/2022');
		ruleDetailsPage
			.getEndDateInput()
			.type('02/02/2022')
			.should('have.value', '02/02/2022');

		ruleDetailsPage.getSaveButton().should('be.enabled').click();

		cy.wait('@createRule').then((xhr) => {
			expect(xhr.request.body).to.eql({
				categoryId: orderedCategoryIds[0],
				regex: 'Hello',
				ordinal: 5,
				minAmount: 1,
				maxAmount: 2,
				startDate: '2022-01-01',
				endDate: '2022-02-02'
			});
		});
	});

	it('can add a new rule with minimum values', () => {
		rulesApi.getAllRules();
		categoriesApi.getAllCategories();
		rulesApi.getMaxOrdinal();
		rulesApi.createRule();
		mountApp({
			initialRoute: '/expense-tracker/rules'
		});

		rulesListPage.getAddRuleButton().click();
		ruleDetailsPage.getHeaderTitle().should('have.text', 'Rule Details');
		validateRuleDialogFields(
			{
				ordinal: 5,
				categoryName: '',
				regex: ''
			},
			true
		);
		ruleDetailsPage.getSaveButton().should('be.disabled');

		ruleDetailsPage.getCategoryInput().click();
		commonPage.getOpenSelectOptions().eq(0).click();
		ruleDetailsPage
			.getCategoryInput()
			.should('have.value', orderedCategoryNames[0]);

		ruleDetailsPage
			.getRegexInput()
			.type('Hello')
			.should('have.value', 'Hello');

		ruleDetailsPage.getSaveButton().should('be.enabled').click();

		cy.wait('@createRule').then((xhr) => {
			expect(xhr.request.body).to.eql({
				categoryId: orderedCategoryIds[0],
				regex: 'Hello',
				ordinal: 5
			});
		});
	});

	it('can update an existing rule', () => {
		const ruleId = allRules.rules[0].id;
		rulesApi.getAllRules();
		categoriesApi.getAllCategories();
		rulesApi.getMaxOrdinal();
		rulesApi.getRule_maximum(ruleId);
		rulesApi.updateRule(ruleId);
		mountApp({
			initialRoute: '/expense-tracker/rules'
		});

		const row = rulesListPage.getRuleRows().eq(0);
		rulesListPage.getDetailsButton(row).click();

		ruleDetailsPage.getHeaderTitle().should('have.text', 'Rule Details');

		ruleDetailsPage.getSaveButton().should('be.disabled');

		ruleDetailsPage
			.getRegexInput()
			.clear()
			.type('Hello')
			.should('have.value', 'Hello');

		ruleDetailsPage.getSaveButton().should('be.enabled').click();
		cy.wait(`@updateRule_${ruleId}`).then((xhr) => {
			expect(xhr.request.body).to.eql({
				categoryId: 'e6a10eec-c1e4-44e6-9100-e834f994ac4c',
				regex: 'Hello',
				ordinal: 1,
				minAmount: 1,
				maxAmount: 2,
				startDate: '2022-01-01',
				endDate: '2022-02-02'
			});
		});
	});

	it('input validation rules', () => {
		const ruleId = allRules.rules[0].id;
		rulesApi.getAllRules();
		categoriesApi.getAllCategories();
		rulesApi.getMaxOrdinal();
		rulesApi.getRule_maximum(ruleId);
		mountApp({
			initialRoute: '/expense-tracker/rules'
		});

		const row = rulesListPage.getRuleRows().eq(0);
		rulesListPage.getDetailsButton(row).click();

		ruleDetailsPage.getHeaderTitle().should('have.text', 'Rule Details');

		const validateInput = validateInputRules({
			getSaveButton: ruleDetailsPage.getSaveButton
		});
		validateInput({
			getInput: ruleDetailsPage.getOrdinalInput,
			getHelperText: ruleDetailsPage.getOrdinalHelperText,
			type: 'select'
		})({
			errorMessage: 'Ordinal is required',
			invalidValue: '',
			validValue: '2'
		});
		validateInput({
			getInput: ruleDetailsPage.getRegexInput,
			getHelperText: ruleDetailsPage.getRegexHelperText
		})({
			errorMessage: 'Regex is required',
			invalidValue: '',
			validValue: 'Hello'
		});
		validateInput({
			getInput: ruleDetailsPage.getStartDateInput,
			getHelperText: ruleDetailsPage.getStartDateHelperText
		})({
			errorMessage: 'Must be valid date',
			invalidValue: '01',
			validValue: '01/01/2022'
		});
		validateInput({
			getInput: ruleDetailsPage.getEndDateInput,
			getHelperText: ruleDetailsPage.getEndDateHelperText
		})({
			errorMessage: 'Must be valid date',
			invalidValue: '01',
			validValue: '01/01/2022'
		});
		validateInput({
			getInput: ruleDetailsPage.getCategoryInput,
			getHelperText: ruleDetailsPage.getCategoryHelperText,
			type: 'select'
		})({
			errorMessage: 'Category is required',
			invalidValue: '',
			validValue: 'Entertainment'
		});
	});

	it('can delete an existing rule', () => {
		const ruleId = allRules.rules[0].id;
		rulesApi.getAllRules();
		categoriesApi.getAllCategories();
		rulesApi.getMaxOrdinal();
		rulesApi.getRule_maximum(ruleId);
		rulesApi.deleteRule(ruleId);
		mountApp({
			initialRoute: '/expense-tracker/rules'
		});

		const row = rulesListPage.getRuleRows().eq(0);
		rulesListPage.getDetailsButton(row).click();

		ruleDetailsPage.getHeaderTitle().should('have.text', 'Rule Details');

		ruleDetailsPage.getDeleteButton().click();
		confirmDialogPage.getConfirmButton().click();

		cy.wait(`@deleteRule_${ruleId}`);

		ruleDetailsPage.getHeaderTitle().should('not.be.visible');
	});
});
