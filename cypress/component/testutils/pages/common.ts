import Chainable = Cypress.Chainable;

const getOpenSelectOptions = (): Chainable<JQuery> =>
	cy.get('.MuiAutocomplete-popper li[role="option"]');

export const commonPage = {
	getOpenSelectOptions
};
