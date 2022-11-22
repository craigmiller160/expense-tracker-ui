import { rulesApi } from './testutils/apis/rules';
import { mountApp } from './testutils/mountApp';

describe('Rules Table', () => {
	it('shows the existing rules in the table', () => {
		rulesApi.getAllRules();
		mountApp({
			initialRoute: '/expense-tracker/rules'
		});
	});
});
