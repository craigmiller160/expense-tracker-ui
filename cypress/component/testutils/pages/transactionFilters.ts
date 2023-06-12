import Chainable = Cypress.Chainable;

const getFiltersRoot = (): Chainable<JQuery> =>
	cy.get('.TransactionSearchFilters');
const getStartDateLabel = (): Chainable<JQuery> =>
	cy.get('#transactionStartDateFilter-label');
const getStartDateInput = (): Chainable<JQuery> =>
	cy.get('#transactionStartDateFilter');
const getEndDateLabel = (): Chainable<JQuery> =>
	cy.get('#transactionEndDateFilter-label');
const getEndDateInput = (): Chainable<JQuery> =>
	cy.get('#transactionEndDateFilter');
const getCategoryLabel = (): Chainable<JQuery> =>
	cy.get('#transactionCategoryFilter-label');
const getCategoryInput = (): Chainable<JQuery> =>
	cy.get('#transactionCategoryFilter');
const getOrderByLabel = (): Chainable<JQuery> =>
	cy.get('#transactionOrderByFilter-label');
const getOrderByInput = (): Chainable<JQuery> =>
	cy.get('#transactionOrderByFilter');
const getDuplicateLabel = (): Chainable<JQuery> =>
	cy.get('#transactionDuplicateFilter-label');
const getDuplicateInput = (): Chainable<JQuery> =>
	cy.get('#transactionDuplicateFilter');
const getConfirmedLabel = (): Chainable<JQuery> =>
	cy.get('#transactionConfirmedFilter-label');
const getConfirmedInput = (): Chainable<JQuery> =>
	cy.get('#transactionConfirmedFilter');
const getCategorizedLabel = (): Chainable<JQuery> =>
	cy.get('#transactionCategorizedFilter-label');
const getCategorizedInput = (): Chainable<JQuery> =>
	cy.get('#transactionCategorizedFilter');
const getPossibleRefundLabel = (): Chainable<JQuery> =>
	cy.get('#transactionPossibleRefundFilter-label');
const getPossibleRefundInput = (): Chainable<JQuery> =>
	cy.get('#transactionPossibleRefundFilter');

export const transactionFilters = {
	getStartDateLabel,
	getStartDateInput,
	getEndDateInput,
	getEndDateLabel,
	getCategorizedLabel,
	getCategorizedInput,
	getDuplicateInput,
	getDuplicateLabel,
	getOrderByLabel,
	getOrderByInput,
	getConfirmedLabel,
	getConfirmedInput,
	getPossibleRefundLabel,
	getPossibleRefundInput,
	getCategoryInput,
	getCategoryLabel,
	getFiltersRoot
};
