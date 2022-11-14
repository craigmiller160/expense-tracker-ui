import Chainable = Cypress.Chainable;

const getNeedsAttentionRoot = (): Chainable<JQuery> =>
	cy.get('[data-testid="needs-attention-notice"]');
const getNeedsAttentionTitle = (): Chainable<JQuery> =>
	getNeedsAttentionRoot().find('h6');
const getUncategorizedItem = (): Chainable<JQuery> =>
	getNeedsAttentionRoot().find('.AttentionItem-Uncategorized');
const getUnconfirmedItem = (): Chainable<JQuery> =>
	getNeedsAttentionRoot().find('.AttentionItem-Unconfirmed');
const getDuplicatesItem = (): Chainable<JQuery> =>
	getNeedsAttentionRoot().find('.AttentionItem-Duplicates');
const getPossibleRefundsItem = (): Chainable<JQuery> =>
	getNeedsAttentionRoot().find('.AttentionItem-Possible_Refunds');

export const needsAttentionPage = {
	getNeedsAttentionRoot,
	getNeedsAttentionTitle,
	getUncategorizedItem,
	getUnconfirmedItem,
	getDuplicatesItem,
	getPossibleRefundsItem
};
