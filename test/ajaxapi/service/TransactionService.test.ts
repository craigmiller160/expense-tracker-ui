import { requestToQuery } from '../../../src/ajaxapi/service/TransactionService';
import { SortDirection } from '../../../src/types/misc';
import { TransactionSortKey } from '../../../src/types/transactions';

export {};

describe('TransactionService', () => {
	describe('requestToQuery', () => {
		it('only required fields', () => {
			const result = requestToQuery({
				pageNumber: 1,
				pageSize: 10,
				sortDirection: SortDirection.ASC,
				sortKey: TransactionSortKey.EXPENSE_DATE
			});
			expect(result).toEqual(
				'pageNumber=1&pageSize=10&sortDirection=ASC&sortKey=EXPENSE_DATE'
			);
		});

		it('all fields', () => {
			throw new Error();
		});
	});
});
