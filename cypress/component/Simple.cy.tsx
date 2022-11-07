import { Simple } from '../../src/components/Simple';
import { MemoryRouter } from 'react-router-dom';

describe('Simple.cy.ts', () => {
	it('Experimenting with stuff', () => {
		cy.mount(
			<MemoryRouter initialEntries={['/']}>
				<Simple />
			</MemoryRouter>
		);
	});
});
