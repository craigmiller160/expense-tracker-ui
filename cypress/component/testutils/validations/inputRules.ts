import Chainable = Cypress.Chainable;

type Config = {
	readonly getInput: () => Chainable<JQuery>;
	readonly getSaveButton: () => Chainable<JQuery>;
	readonly getHelperText: () => Chainable<JQuery>;
	readonly errorMessage: string;
	readonly validValue: string;
	readonly invalidValue: string;
};

export const validateInputRules = ({
	getInput,
	getSaveButton,
	getHelperText,
	errorMessage,
	validValue,
	invalidValue
}: Config) => {
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
