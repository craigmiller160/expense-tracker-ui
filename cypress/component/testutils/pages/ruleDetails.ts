import Chainable = Cypress.Chainable;
import { pipe } from 'fp-ts/es6/function';
import { getHelperTextForLabel, getInputForLabel } from './utils';

const getHeaderTitle = (): Chainable<JQuery> =>
	cy.get('#RuleDetailsDialog-header .MuiToolbar-root h6');
const getContentTitle = (): Chainable<JQuery> =>
	cy.get('#RuleDetailsDialog-body h6');
const getCloseButton = (): Chainable<JQuery> =>
	cy.get('#RuleDetailsDialog-header .MuiToolbar-root button');
const getSaveButton = (): Chainable<JQuery> =>
	cy.get('#RuleDetailsDialog-footer button').eq(0);
const getDeleteButton = (): Chainable<JQuery> =>
	cy.get('#RuleDetailsDialog-footer button').eq(1);
const getOrdinalLabel = (): Chainable<JQuery> =>
	cy.get('#RuleDetailsDialog .AutoCategorizeRuleDetailsForm label').eq(0);
const getCategoryLabel = (): Chainable<JQuery> =>
	cy.get('#RuleDetailsDialog .AutoCategorizeRuleDetailsForm label').eq(1);
const getRegexLabel = (): Chainable<JQuery> =>
	cy.get('#RuleDetailsDialog .AutoCategorizeRuleDetailsForm label').eq(2);
const getStartDateLabel = (): Chainable<JQuery> =>
	cy.get('#RuleDetailsDialog .AutoCategorizeRuleDetailsForm label').eq(3);
const getEndDateLabel = (): Chainable<JQuery> =>
	cy.get('#RuleDetailsDialog .AutoCategorizeRuleDetailsForm label').eq(4);
const getMinAmountLabel = (): Chainable<JQuery> =>
	cy.get('#RuleDetailsDialog .AutoCategorizeRuleDetailsForm label').eq(5);
const getMaxAmountLabel = (): Chainable<JQuery> =>
	cy.get('#RuleDetailsDialog .AutoCategorizeRuleDetailsForm label').eq(6);
const getOrdinalInput = (): Chainable<JQuery> =>
	pipe(getOrdinalLabel(), getInputForLabel);
const getOrdinalHelperText = (): Chainable<JQuery> =>
	pipe(getOrdinalLabel(), getHelperTextForLabel);
const getCategoryInput = (): Chainable<JQuery> =>
	pipe(getCategoryLabel(), getInputForLabel);
const getCategoryHelperText = (): Chainable<JQuery> =>
	pipe(getCategoryLabel(), getHelperTextForLabel);
const getRegexInput = (): Chainable<JQuery> =>
	pipe(getRegexLabel(), getInputForLabel);
const getRegexHelperText = (): Chainable<JQuery> =>
	pipe(getRegexLabel(), getHelperTextForLabel);

export const ruleDetailsPage = {
	getHeaderTitle,
	getContentTitle,
	getCloseButton,
	getSaveButton,
	getDeleteButton,
	getOrdinalLabel,
	getCategoryLabel,
	getRegexLabel,
	getStartDateLabel,
	getEndDateLabel,
	getMaxAmountLabel,
	getMinAmountLabel,
	getRegexHelperText,
	getRegexInput,
	getCategoryHelperText,
	getCategoryInput,
	getOrdinalHelperText,
	getOrdinalInput
};
