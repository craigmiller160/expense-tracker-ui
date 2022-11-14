import Chainable = Cypress.Chainable;

const getNeedsAttention_all = (): Chainable<null> =>
	cy
		.intercept('/expense-tracker/api/transactions/needs-attention', {
			fixture: 'needsAttention_all.json'
		})
		.as('getNeedsAttention');

export const needsAttentionApi = {
	getNeedsAttention_all
};
