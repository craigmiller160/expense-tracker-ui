type Chainable<T> = Cypress.Chainable<T>;

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

const createRule = (): Chainable<null> =>
	cy
		.intercept('post', '/expense-tracker/api/categories/rules', {
			statusCode: 204
		})
		.as('createRule');

const updateRule = (id: string): Chainable<null> =>
	cy
		.intercept('put', `/expense-tracker/api/categories/rules/${id}`, {
			statusCode: 204
		})
		.as(`updateRule_${id}`);

const deleteRule = (id: string): Chainable<null> =>
	cy
		.intercept('delete', `/expense-tracker/api/categories/rules/${id}`, {
			statusCode: 204
		})
		.as(`deleteRule_${id}`);

const getMaxOrdinal = (): Chainable<null> =>
	cy.intercept('/expense-tracker/api/categories/rules/maxOrdinal', {
		fixture: 'maxOrdinal.json'
	});

const reOrderRule = (id: string, ordinal: number): Chainable<null> =>
	cy
		.intercept(
			'put',
			`/expense-tracker/api/categories/rules/${id}/reOrder/${ordinal}`,
			{
				statusCode: 204
			}
		)
		.as(`reOrderRule_${id}_${ordinal}`);

export const rulesApi = {
	getAllRules,
	getRule_minimum,
	getRule_maximum,
	createRule,
	updateRule,
	deleteRule,
	getMaxOrdinal,
	reOrderRule
};
