import Chainable = Cypress.Chainable;

const getNeedsAttention_all = (): Chainable<null> =>
	cy
		.intercept('/expense-tracker/api/needs-attention', {
			fixture: 'needsAttention_all.json'
		})
		.as('getNeedsAttention_all');

export const needsAttentionApi = {
	getNeedsAttention_all
};
