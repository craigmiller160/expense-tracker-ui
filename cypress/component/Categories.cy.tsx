import { getAllCategories } from './testutils/apis/categories';
import { mountApp } from './testutils/mountApp';

const CATEGORY_NAMES = ['Entertainment', 'Groceries', 'Restaurants', 'Travel'];

describe('Manage Categories', () => {
	it('displays all categories on the server', () => {
		getAllCategories();
		mountApp({
			initialRoute: '/expense-tracker/categories'
		});
		cy.get('#navbar')
			.find('.LinkButton')
			.filter((index, $node) => $node.textContent === 'Manage Categories')
			.should('have.class', 'active');
		cy.get('.Categories').find('h4').contains('Manage Categories');
		cy.get('.Categories table tr')
			.should('have.length', 5)
			.each(($node, index) => {
				// Skip the header
				if (index > 0) {
					expect($node.children('td')).length(2);
					const nameCell = $node.children('td').eq(0);
					expect(nameCell.text()).to.eq(CATEGORY_NAMES[index - 1]);

					const detailsCell = $node
						.children('td')
						.eq(1)
						.children('button');
					expect(detailsCell.text()).to.eq('Details');
				}
			});
	});

	it('adds new category', () => {
		throw new Error();
	});

	it('will not save category without name', () => {
		throw new Error();
	});

	it('updates category name', () => {
		throw new Error();
	});

	it('deletes category', () => {
		throw new Error();
	});
});
