import Chainable = Cypress.Chainable;

const getOpenSelectOptions = (): Chainable<JQuery> =>
	cy.get('.MuiAutocomplete-popper li[role="option"]');
const getMultipleSelectValues = (
	select: Chainable<JQuery>
): Chainable<JQuery> => select.find('.MuiChip-label');

export const commonPage = {
	getOpenSelectOptions,
	getMultipleSelectValues
};
