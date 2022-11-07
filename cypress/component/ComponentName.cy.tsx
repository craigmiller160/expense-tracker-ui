import { PageTitle } from '../../src/components/UI/PageTitle';

describe('ComponentName.cy.ts', () => {
	it('playground', () => {
		cy.mount(<PageTitle title="Hello World" />);
	});
});
