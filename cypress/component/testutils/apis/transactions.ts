import Chainable = Cypress.Chainable;
import { TransactionDetailsResponse } from '../../../../src/types/generated/expense-tracker';

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
		);
const updateTransactionDetails = (id: string): Chainable<null> =>
	cy
		.intercept('put', `/expense-tracker/api/transactions/${id}/details`, {
			statusCode: 204
		})
		.as(`updateTransactionDetails_${id}`);

export const transactionsApi = {
	searchForTransactions,
	getTransactionDetails,
	updateTransactionDetails
};
