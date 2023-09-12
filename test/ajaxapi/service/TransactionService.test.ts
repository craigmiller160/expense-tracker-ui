import { requestToQuery } from '../../../src/ajaxapi/service/TransactionService';
import { SortDirection, TransactionSortKey } from '../../../src/types/misc';
import { Time } from '@craigmiller160/ts-functions';

describe('TransactionService', () => {
	describe('requestToQuery', () => {
		it('only required fields', () => {
			const result = requestToQuery({
				pageNumber: 1,
				pageSize: 10,
				sortDirection: SortDirection.ASC,
				sortKey: TransactionSortKey.EXPENSE_DATE,
				startDate: null,
				endDate: null,
				categorized: 'ALL',
				confirmed: 'ALL',
				duplicate: 'ALL',
				possibleRefund: 'ALL'
			});
			expect(result).toEqual(
				'pageNumber=1&pageSize=10&sortDirection=ASC&sortKey=EXPENSE_DATE&categorized=ALL&confirmed=ALL&duplicate=ALL&possibleRefund=ALL'
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
				confirmed: 'ALL',
				categorized: 'ALL',
				duplicate: 'ALL',
				possibleRefund: 'ALL',
				categoryIds: ['1', '2']
			});
			expect(result).toEqual(
				'pageNumber=1&pageSize=10&sortDirection=ASC&sortKey=EXPENSE_DATE&startDate=2022-01-01&endDate=2022-01-02&confirmed=ALL&categorized=ALL&duplicate=ALL&possibleRefund=ALL&categoryIds=1%2C2'
			);
		});

		it('removes category ids if categorized is NO', () => {
			const result = requestToQuery({
				pageNumber: 1,
				pageSize: 10,
				sortDirection: SortDirection.ASC,
				sortKey: TransactionSortKey.EXPENSE_DATE,
				startDate: null,
				endDate: null,
				categorized: 'NO',
				confirmed: 'ALL',
				duplicate: 'ALL',
				possibleRefund: 'ALL',
				categoryIds: ['1', '2']
			});
			expect(result).toEqual(
				'pageNumber=1&pageSize=10&sortDirection=ASC&sortKey=EXPENSE_DATE&categorized=NO&confirmed=ALL&duplicate=ALL&possibleRefund=ALL'
			);
		});
	});
});
