import Chainable = Cypress.Chainable;

export const getInputForLabel = (
	labelWrappedInChainable: Chainable<JQuery>
): Chainable<JQuery> =>
	labelWrappedInChainable
		.invoke('attr', 'for')
		.then((forValue) => cy.get(`[id="${forValue}"]`));

export const getHelperTextForLabel = (
	labelWrappedInChainable: Chainable<JQuery>
): Chainable<JQuery> =>
	labelWrappedInChainable
		.invoke('attr', 'for')
		.then((forValue) => cy.get(`[id="${forValue}-helper-text"]`));
