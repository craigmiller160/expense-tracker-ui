import Chainable = Cypress.Chainable;

const getAllRules = (): Chainable<null> =>
	cy
		.intercept('/expense-tracker/api/categories/rules?*', {
			fixture: 'allRules.json'
		})
		.as('getAllRules');

export const rulesApi = {
	getAllRules
};
