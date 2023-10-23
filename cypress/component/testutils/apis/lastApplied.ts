type Chainable<T> = Cypress.Chainable<T>;

const getLastRuleApplied = (id: string): Chainable<null> =>
	cy
		.intercept(
			`/expense-tracker/api/transactions/rules/last-applied/${id}`,
			{
				fixture: 'lastApplied.json'
			}
		)
		.as(`getLastRuleApplied_${id}`);
const getLastRuleApplied_noRule = (id: string): Chainable<null> =>
	cy
		.intercept(
			`/expense-tracker/api/transactions/rules/last-applied/${id}`,
			{
				statusCode: 204
			}
		)
		.as(`getLastRuleApplied_noRule_${id}`);

export const lastAppliedApi = {
	getLastRuleApplied,
	getLastRuleApplied_noRule
};
