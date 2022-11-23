import Chainable = Cypress.Chainable;

const getAllRules = (): Chainable<null> =>
	cy
		.intercept('/expense-tracker/api/categories/rules?*', {
			fixture: 'allRules.json'
		})
		.as('getAllRules');

const getRule_minimum = (id: string): Chainable<null> =>
	cy.intercept(`/expense-tracker/api/categories/rules/${id}`, {
		fixture: 'ruleDetails_minimum.json'
	});

const getRule_maximum = (id: string): Chainable<null> =>
	cy.intercept(`/expense-tracker/api/categories/rules/${id}`, {
		fixture: 'ruleDetails_maximum.json'
	});

export const rulesApi = {
	getAllRules,
	getRule_minimum,
	getRule_maximum
};
