import Chainable = Cypress.Chainable;

const getLastRuleApplied = (id: string): Chainable<null> =>
	cy
		.intercept(
			`/expense-tracker/api/transactions/rules/last-applied/${id}`,
			{
				fixture: 'lastApplied.json'
			}
		)
		.as(`getLastRuleApplied_${id}`);

export const lastAppliedApi = {
	getLastRuleApplied
};
