import Chainable = Cypress.Chainable;

const getOpenAutoCompleteOptions = (): Chainable<JQuery> =>
	cy.get('.MuiAutocomplete-popper li[role="option"]');
const getMultipleSelectValues = (
	selectInput: Chainable<JQuery>
): Chainable<JQuery> => selectInput.parent().find('.MuiChip-label');

const getOpenSelectOptions = (): Chainable<JQuery> =>
	cy.get('.MuiList-root li[role="option"]');

const dismissPopupOptions = (): Chainable<JQuery<HTMLBodyElement>> =>
	cy.get('body').click(0, 0);

export const commonPage = {
	getOpenAutoCompleteOptions,
	getOpenSelectOptions,
	getMultipleSelectValues,
	dismissPopupOptions
};
