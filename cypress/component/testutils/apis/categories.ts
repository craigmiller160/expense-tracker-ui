type Chainable<T> = Cypress.Chainable<T>;

const getAllCategories = (): Chainable<null> =>
	cy
		.intercept('/expense-tracker/api/categories', {
			fixture: 'allCategories.json'
		})
		.as('getAllCategories');

const getUnknownCategory = (): Chainable<null> =>
	cy
		.intercept('/expense-tracker/api/categories/unknown', {
			fixture: 'unknownCategory.json'
		})
		.as('getUnknownCategory');

const createCategory = (): Chainable<null> =>
	cy
		.intercept('post', '/expense-tracker/api/categories')
		.as('createCategory');

const deleteCategory = (id: string): Chainable<null> =>
	cy
		.intercept('delete', `/expense-tracker/api/categories/${id}`, {
			statusCode: 204
		})
		.as(`deleteCategory_${id}`);

const updateCategory = (id: string): Chainable<null> =>
	cy
		.intercept('put', `/expense-tracker/api/categories/${id}`, {
			statusCode: 204
		})
		.as(`updateCategory_${id}`);

export const categoriesApi = {
	getAllCategories,
	createCategory,
	deleteCategory,
	updateCategory,
	getUnknownCategory
};
