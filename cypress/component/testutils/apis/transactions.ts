import Chainable = Cypress.Chainable;
import { TransactionDetailsResponse } from '../../../../src/types/generated/expense-tracker';
import { allCategories } from '../constants/categories';

const searchForTransactions = (): Chainable<null> =>
	cy.intercept('/expense-tracker/api/transactions?*', {
		fixture: 'allTransactions.json'
	});
const getTransactionDetails = (id: string): Chainable<null> =>
	cy
		.fixture('transactionDetails.json')
		.then((fixture: TransactionDetailsResponse) =>
			cy.intercept(`/expense-tracker/api/transactions/${id}/details`, {
				...fixture,
				id
			})
		)
		.as(`getTransactionDetails_${id}`);
const getTransactionDetails_confirmedAndCategorized = (
	id: string
): Chainable<null> =>
	cy
		.fixture('transactionDetails.json')
		.then((fixture: TransactionDetailsResponse) =>
			cy.intercept(`/expense-tracker/api/transactions/${id}/details`, {
				...fixture,
				id,
				confirmed: true,
				categoryId: allCategories[0].id,
				categoryName: allCategories[1].name
			})
		);
const getTransactionDetails_possibleRefund = (id: string): Chainable<null> =>
	cy
		.fixture('transactionDetails.json')
		.then((fixture: TransactionDetailsResponse) =>
			cy.intercept(`/expense-tracker/api/transactions/${id}/details`, {
				...fixture,
				id,
				confirmed: true,
				categoryId: allCategories[0].id,
				categoryName: allCategories[1].name,
				amount: 10
			})
		);
const getTransactionDetails_duplicate = (id: string): Chainable<null> =>
	cy
		.fixture('transactionDetails.json')
		.then((fixture: TransactionDetailsResponse) =>
			cy.intercept(`/expense-tracker/api/transactions/${id}/details`, {
				...fixture,
				id,
				confirmed: true,
				categoryId: allCategories[0].id,
				categoryName: allCategories[1].name,
				duplicate: true
			})
		);
const updateTransactionDetails = (id: string): Chainable<null> =>
	cy
		.intercept('put', `/expense-tracker/api/transactions/${id}/details`, {
			statusCode: 204
		})
		.as(`updateTransactionDetails_${id}`);
const getNeedsAttention = (): Chainable<null> =>
	cy.intercept('/expense-tracker/api/transactions/needs-attention', {
		fixture: 'needsAttention.json'
	});
const createTransaction = (): Chainable<null> =>
	cy
		.intercept('post', '/expense-tracker/api/transactions', {
			statusCode: 204
		})
		.as('createTransaction');
const getPossibleDuplicates = (id: string): Chainable<null> =>
	cy
		.intercept(`/expense-tracker/api/transactions/${id}/duplicates?*`, {
			fixture: 'possibleDuplicates.json'
		})
		.as(`getPossibleDuplicates_${id}`);

export const transactionsApi = {
	searchForTransactions,
	getTransactionDetails,
	updateTransactionDetails,
	getNeedsAttention,
	createTransaction,
	getTransactionDetails_confirmedAndCategorized,
	getTransactionDetails_possibleRefund,
	getPossibleDuplicates,
	getTransactionDetails_duplicate
};
