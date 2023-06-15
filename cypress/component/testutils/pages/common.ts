import Chainable = Cypress.Chainable;

const getOpenAutoCompleteOptions = (): Chainable<JQuery> =>
	cy.get('.MuiAutocomplete-popper li[role="option"]');
const getMultipleSelectValues = (
	selectInput: Chainable<JQuery>
): Chainable<JQuery> => selectInput.parent().find('.MuiChip-label');

const getOpenSelectOptions = (): Chainable<JQuery> =>
	cy.get('.MuiList-root li[role="option"]');

export const commonPage = {
	getOpenAutoCompleteOptions,
	getOpenSelectOptions,
	getMultipleSelectValues
};
