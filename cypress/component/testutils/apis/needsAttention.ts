type Chainable<T> = Cypress.Chainable<T>;

const getNeedsAttention_all = (): Chainable<null> =>
	cy
		.intercept('/expense-tracker/api/needs-attention', {
			fixture: 'needsAttention_all.json'
		})
		.as('getNeedsAttention_all');

const getNeedsAttention_none = (): Chainable<null> =>
	cy
		.intercept('/expense-tracker/api/needs-attention', {
			fixture: 'needsAttention_none.json'
		})
		.as('getNeedsAttention_none');
const getNeedsAttention_duplicates = (): Chainable<null> =>
	cy
		.intercept('/expense-tracker/api/needs-attention', {
			fixture: 'needsAttention_duplicates.json'
		})
		.as('getNeedsAttention_duplicates');
const getNeedsAttention_possibleRefund = (): Chainable<null> =>
	cy
		.intercept('/expense-tracker/api/needs-attention', {
			fixture: 'needsAttention_possibleRefund.json'
		})
		.as('getNeedsAttention_possibleRefund');
const getNeedsAttention_uncategorized = (): Chainable<null> =>
	cy
		.intercept('/expense-tracker/api/needs-attention', {
			fixture: 'needsAttention_uncategorized.json'
		})
		.as('getNeedsAttention_uncategorized');
const getNeedsAttention_unconfirmed = (): Chainable<null> =>
	cy
		.intercept('/expense-tracker/api/needs-attention', {
			fixture: 'needsAttention_unconfirmed.json'
		})
		.as('getNeedsAttention_unconfirmed');

export const needsAttentionApi = {
	getNeedsAttention_all,
	getNeedsAttention_none,
	getNeedsAttention_duplicates,
	getNeedsAttention_unconfirmed,
	getNeedsAttention_uncategorized,
	getNeedsAttention_possibleRefund
};
