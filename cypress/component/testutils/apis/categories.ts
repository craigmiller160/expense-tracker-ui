import Chainable = Cypress.Chainable;

export const getAllCategories = (): Chainable<null> =>
	cy.intercept('/expense-tracker/api/categories', {
		fixture: 'allCategories.json'
	});

export const createCategory = (): Chainable<null> =>
	cy
		.intercept('post', '/expense-tracker/api/categories')
		.as('createCategory');

export const deleteCategory = (id: string): Chainable<null> =>
	cy
		.intercept('delete', `/expense-tracker/api/categories/${id}`, {
			statusCode: 204
		})
		.as(`deleteCategory_${id}`);

export const updateCategory = (id: string): Chainable<null> =>
	cy
		.intercept('put', `/expense-tracker/api/categories/${id}`, {
			statusCode: 204
		})
		.as(`updateCategory_${id}`);
