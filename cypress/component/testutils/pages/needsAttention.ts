import Chainable = Cypress.Chainable;

const getNeedsAttentionRoot = (): Chainable<JQuery> =>
	cy.get('[data-testid="needs-attention-notice"]');
const getNeedsAttentionTitle = (): Chainable<JQuery> =>
	getNeedsAttentionRoot().find('h6');

export const needsAttentionPage = {
	getNeedsAttentionTitle
};
