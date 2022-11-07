import Chainable = Cypress.Chainable;

const getHeaderTitle = (): Chainable<JQuery> =>
	cy.get('#CategoryDetailsDialog-header .MuiToolbar-root h6');
const getContentTitle = (): Chainable<JQuery> =>
	cy.get('#CategoryDetailsDialog-body h6');
const getCategoryNameLabel = (): Chainable<JQuery> =>
	cy.get('#CategoryDetailsDialog-body label').eq(0);
const getCategoryNameInput = (): Chainable<JQuery> =>
	getCategoryNameLabel()
		.invoke('attr', 'for')
		.then((forValue) => cy.get(`[id="${forValue}"]`));
const getCategoryNameInputHelperText = (): Chainable<JQuery> =>
	getCategoryNameLabel()
		.invoke('attr', 'for')
		.then((forValue) => cy.get(`[id="${forValue}-helper-text"]`));
const getCloseButton = (): Chainable<JQuery> =>
	cy.get('#CategoryDetailsDialog-header .MuiToolbar-root button');
const getSaveButton = (): Chainable<JQuery> =>
	cy.get('#CategoryDetailsDialog-footer button:nth-of-type(1)');
const getDeleteButton = (): Chainable<JQuery> =>
	cy.get('#CategoryDetailsDialog-footer button:nth-of-type(2)');

export const categoryDetailsPage = {
	getHeaderTitle,
	getContentTitle,
	getCategoryNameLabel,
	getCategoryNameInput,
	getCategoryNameInputHelperText,
	getCloseButton,
	getSaveButton,
	getDeleteButton
};
