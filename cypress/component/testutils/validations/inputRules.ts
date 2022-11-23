import Chainable = Cypress.Chainable;

type PageConfig = {
	readonly getSaveButton: () => Chainable<JQuery>;
};
type InputConfig = {
	readonly getInput: () => Chainable<JQuery>;
	readonly getHelperText: () => Chainable<JQuery>;
};
type RuleConfig = {
	readonly errorMessage: string;
	readonly validValue: string;
	readonly invalidValue: string;
};

export const validateInputRules =
	({ getSaveButton }: PageConfig) =>
	({ getInput, getHelperText }: InputConfig) =>
	({ errorMessage, validValue, invalidValue }: RuleConfig) => {
		getInput().clear();
		if (invalidValue) {
			getInput().type(invalidValue);
		}
		getSaveButton().should('be.disabled');
		getHelperText().contains(errorMessage);

		getInput().type(validValue);
		getHelperText().should('not.exist');
		getSaveButton().should('not.be.disabled');
	};
