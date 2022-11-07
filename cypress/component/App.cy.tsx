import { App } from '../../src/components/App';

describe('App.cy.tsx', () => {
	it('The whole app mounts', () => {
		cy.mount(<App />);
	});
});
