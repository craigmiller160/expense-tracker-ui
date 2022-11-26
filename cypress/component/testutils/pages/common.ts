import Chainable = Cypress.Chainable;

const getOpenSelectOptions = (): Chainable<JQuery> =>
	cy.get('.MuiAutocomplete-popper li[role="option"]');
const getMultipleSelectValues = (
	selectInput: Chainable<JQuery>
): Chainable<JQuery> => selectInput.parent().find('.MuiChip-label');

export const commonPage = {
	getOpenSelectOptions,
	getMultipleSelectValues
};
