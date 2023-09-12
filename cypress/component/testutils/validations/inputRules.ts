import Chainable = Cypress.Chainable;
import { commonPage } from '../pages/common';

type Selector = () => Chainable<JQuery>;

type PageConfig = {
	readonly getSaveButton: Selector;
};
type InputType = 'text' | 'select';
type InputConfig = {
	readonly getInput: Selector;
	readonly getHelperText: Selector;
	readonly type?: InputType;
};
type RuleConfig = {
	readonly errorMessage: string;
	readonly validValue: string;
	readonly invalidValue: string;
};

const setValue = (getInput: Selector, type: InputType, value: string) => {
	if (type === 'select') {
		commonPage.getOpenAutoCompleteOptions().contains(value).click();
	} else {
		getInput().type(value);
	}
};

export const validateInputRules =
	({ getSaveButton }: PageConfig) =>
	({ getInput, getHelperText, type = 'text' }: InputConfig) =>
	({ errorMessage, validValue, invalidValue }: RuleConfig) => {
		getInput().clear();
		if (invalidValue) {
			setValue(getInput, type, invalidValue);
		}
		getSaveButton().should('be.disabled');
		getHelperText().contains(errorMessage);

		setValue(getInput, type, validValue);
		getHelperText().should('not.exist');
		getSaveButton().should('not.be.disabled');
	};
