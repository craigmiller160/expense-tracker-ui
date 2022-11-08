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
				fixture: {
					...fixture,
					id
				}
			})
		);

export const transactionsApi = {
	searchForTransactions,
	getTransactionDetails
};
