import { Simple } from '../../src/components/Simple';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

describe('Simple.cy.ts', () => {
	it('Experimenting with stuff', () => {
		cy.mount(
			<MemoryRouter>
				<Simple />
			</MemoryRouter>
		);
	});
});
