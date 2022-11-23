import Chainable = Cypress.Chainable;

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

export const ruleDetailsPage = {
	getHeaderTitle,
	getContentTitle,
	getCloseButton,
	getSaveButton,
	getDeleteButton
};
