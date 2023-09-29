import Chainable = Cypress.Chainable;

const getTitle = (): Chainable<JQuery> => cy.get('.ManageTransactions h4');
const getDetailsButtons = (): Chainable<JQuery> =>
	cy.get('.ManageTransactions table .DetailsButton');
const getConfirmCheckboxes = (): Chainable<JQuery> =>
	cy.get(
		'.ManageTransactions table [data-testid="confirm-transaction-checkbox"] input'
	);
const getCategorySelects = (): Chainable<JQuery> =>
	cy.get('.ManageTransactions table .category-cell input');
const getAddTransactionButton = (): Chainable<JQuery> =>
	cy.get('#add-transaction-button');
const getDeleteAllUnconfirmedTransactionsButton = () =>
	cy.get('#delete-all-unconfirmed-transactions-button');
const getResetButton = (): Chainable<JQuery> =>
	cy
		.get(
			'.ManageTransactions .transactions-table .BelowTableActionWrapper button'
		)
		.eq(0);

export const transactionsListPage = {
	getTitle,
	getDetailsButtons,
	getAddTransactionButton,
	getConfirmCheckboxes,
	getCategorySelects,
	getResetButton,
	getDeleteAllUnconfirmedTransactionsButton
};
