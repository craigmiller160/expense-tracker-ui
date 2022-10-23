import { requestToQuery } from '../../../src/ajaxapi/service/TransactionService';
import { SortDirection, TransactionSortKey } from '../../../src/types/misc';
import * as Time from '@craigmiller160/ts-functions/es/Time';

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
			const startDate = Time.set({
				year: 2022,
				month: 0,
				date: 1
			})(new Date());
			const endDate = Time.set({
				year: 2022,
				month: 0,
				date: 2
			})(new Date());
			const result = requestToQuery({
				pageNumber: 1,
				pageSize: 10,
				sortDirection: SortDirection.ASC,
				sortKey: TransactionSortKey.EXPENSE_DATE,
				startDate,
				endDate,
				isConfirmed: true,
				isCategorized: true,
				isDuplicate: false,
				categoryIds: ['1', '2']
			});
			expect(result).toEqual(
				'pageNumber=1&pageSize=10&sortDirection=ASC&sortKey=EXPENSE_DATE&startDate=2022-01-01&endDate=2022-01-02&isConfirmed=true&isCategorized=true&isDuplicate=false&categoryIds=1%2C2'
			);
		});
	});
});
