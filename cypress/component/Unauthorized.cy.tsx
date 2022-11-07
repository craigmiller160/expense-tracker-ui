import { mountApp } from './testutils/mountApp';

describe('Unauthorized.cy.tsx', () => {
	it('The app displays in an unauthorized state', () => {
		mountApp({
			isAuthorized: false
		});
	});
});
