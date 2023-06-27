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
const getOrderByInputWrapper = (): Chainable<JQuery> =>
	cy.get('#transactionOrderByFilter-wrapper');
const getDuplicateLabel = (): Chainable<JQuery> =>
	cy.get('#transactionDuplicateFilter-label');
const getDuplicateInput = (): Chainable<JQuery> =>
	cy.get('#transactionDuplicateFilter');
const getDuplicateInputWrapper = (): Chainable<JQuery> =>
	cy.get('#transactionDuplicateFilter-wrapper');
const getConfirmedLabel = (): Chainable<JQuery> =>
	cy.get('#transactionConfirmedFilter-label');
const getConfirmedInput = (): Chainable<JQuery> =>
	cy.get('#transactionConfirmedFilter');
const getConfirmedInputWrapper = (): Chainable<JQuery> =>
	cy.get('#transactionConfirmedFilter-wrapper');
const getCategorizedLabel = (): Chainable<JQuery> =>
	cy.get('#transactionCategorizedFilter-label');
const getCategorizedInput = (): Chainable<JQuery> =>
	cy.get('#transactionCategorizedFilter');
const getCategorizedInputWrapper = (): Chainable<JQuery> =>
	cy.get('#transactionCategorizedFilter-wrapper');
const getPossibleRefundLabel = (): Chainable<JQuery> =>
	cy.get('#transactionPossibleRefundFilter-label');
const getPossibleRefundInput = (): Chainable<JQuery> =>
	cy.get('#transactionPossibleRefundFilter');
const getPossibleRefundInputWrapper = (): Chainable<JQuery> =>
	cy.get('#transactionPossibleRefundFilter-wrapper');
const getResetFilterButton = (): Chainable<JQuery> =>
	cy.get('#transactionFilterResetButton');
const getDescriptionFilter = (): Chainable<JQuery> =>
	cy.get('#descriptionFilter');
const getDescriptionFilterLabel = (): Chainable<JQuery> =>
	cy.get('#descriptionFilter-label');

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
	getFiltersRoot,
	getOrderByInputWrapper,
	getConfirmedInputWrapper,
	getCategorizedInputWrapper,
	getPossibleRefundInputWrapper,
	getDuplicateInputWrapper,
	getResetFilterButton,
	getDescriptionFilterInput: getDescriptionFilter,
	getDescriptionFilterLabel
};
