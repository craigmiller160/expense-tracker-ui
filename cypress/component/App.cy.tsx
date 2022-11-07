import { App } from '../../src/components/App';
import { MemoryRouter } from 'react-router-dom';

describe('App.cy.tsx', () => {
	it('The whole app mounts', () => {
		cy.mount(
			<MemoryRouter initialEntries={['/expense-tracker']}>
				<App />
			</MemoryRouter>
		);
	});
});
