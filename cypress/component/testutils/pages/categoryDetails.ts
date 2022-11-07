import Chainable = Cypress.Chainable;

const getHeaderTitle = (): Chainable<JQuery> =>
	cy.get('#CategoryDetailsDialog .MuiToolbar-root h6');
const getContentTitle = (): Chainable<JQuery> =>
	cy.get('#CategoryDetailsDialog .MuiDialogContent-root h6');
const getCategoryNameLabel = (): Chainable<JQuery> =>
	cy.get('#CategoryDetailsDialog label').eq(0);
const getCategoryNameInput = (): Chainable<JQuery> =>
	getCategoryNameLabel()
		.invoke('attr', 'for')
		.then((forValue) => cy.get(`#${forValue}`));
const getCloseButton = (): Chainable<JQuery> =>
	cy.get('#CategoryDetailsDialog .MuiToolbar-root button');
const getSaveButton = (): Chainable<JQuery> =>
	cy.get(
		'#CategoryDetailsDialog .MuiDialogActions-root button:nth-of-type(1)'
	);
const getDeleteButton = (): Chainable<JQuery> =>
	cy.get(
		'#CategoryDetailsDialog .MuiDialogActions-root button:nth-of-type(2)'
	);

export const categoryDetailsPage = {
	getHeaderTitle,
	getContentTitle,
	getCategoryNameInput,
	getCloseButton,
	getSaveButton,
	getDeleteButton
};
