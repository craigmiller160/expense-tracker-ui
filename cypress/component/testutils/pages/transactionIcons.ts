import Chainable = Cypress.Chainable;

const getDuplicateIcons = (): Chainable<JQuery> =>
	cy.get('[data-testid="duplicate-icon"]');
const getNotCategorizedIcons = (): Chainable<JQuery> =>
	cy.get('[data-testid="no-category-icon"]');
const getNotConfirmedIcon = (): Chainable<JQuery> =>
	cy.get('[data-testid="not-confirmed-icon"]');
const getPossibleRefundIcon = (): Chainable<JQuery> =>
	cy.get('[data-testid="possible-refund-icon"]');

export const transactionIconsPage = {
	getDuplicateIcons,
	getNotCategorizedIcons,
	getNotConfirmedIcon,
	getPossibleRefundIcon
};
