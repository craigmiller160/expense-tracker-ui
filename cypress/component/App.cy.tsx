import { App } from '../../src/components/App';
import { MemoryRouter } from 'react-router-dom';

describe('App.cy.tsx', () => {
	it('The whole app mounts', () => {
		cy.viewport(1920, 1080);
		cy.intercept('/expense-tracker/api/oauth/user', {
			fixture: 'authorizedUser.json'
		});
		cy.mount(
			<MemoryRouter initialEntries={['/expense-tracker']}>
				<App />
			</MemoryRouter>
		);
	});
});
