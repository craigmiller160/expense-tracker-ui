import { categoriesApi } from './testutils/apis/categories';
import { needsAttentionApi } from './testutils/apis/needsAttention';
import { transactionsApi } from './testutils/apis/transactions';
import { mountApp } from './testutils/mountApp';
import { transactionFilters } from './testutils/pages/transactionFilters';
import { subMonths, format } from 'date-fns/fp';
import { flow } from 'fp-ts/es6/function';

const DATE_FORMAT = 'MM/dd/yyyy';

const defaultStartDate = flow(subMonths(1), format(DATE_FORMAT))(new Date());
const defaultEndDate = format(DATE_FORMAT)(new Date());

describe('Transactions Filters', () => {
	it('renders all filters', () => {
		categoriesApi.getAllCategories();
		needsAttentionApi.getNeedsAttention_all();
		transactionsApi.searchForTransactions();
		mountApp({
			initialRoute: '/expense-tracker/transactions'
		});

		transactionFilters
			.getStartDateLabel()
			.should('have.text', 'Start Date');
		transactionFilters
			.getStartDateInput()
			.should('have.value', defaultStartDate);

		transactionFilters.getEndDateLabel().should('have.text', 'End Date');
		transactionFilters
			.getEndDateInput()
			.should('have.value', defaultEndDate);

		// TODO need to validate all labels and options in selects
	});

	it('possible refund control', () => {
		throw new Error();
	});

	it('category control', () => {
		throw new Error();
	});

	it('duplicate control', () => {
		throw new Error();
	});

	it('categorized control', () => {
		throw new Error();
	});

	it('confirmed control', () => {
		throw new Error();
	});
});
