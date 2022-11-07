import { PageTitle } from '../../src/components/UI/PageTitle';

describe('PageTitle.cy.ts', () => {
	it('Has expected text', () => {
		cy.mount(<PageTitle title="Hello World" />);
		cy.get('h4').contains('Hello World');
	});
});
