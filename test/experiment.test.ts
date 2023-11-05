import { describe, it } from 'vitest';
import { createServer, Server } from 'miragejs';
import { searchForTransactions } from '../src/ajaxapi/service/TransactionService';
import {
	defaultEndDate,
	defaultStartDate
} from '../src/components/Content/Transactions/utils';
import { SortDirection, TransactionSortKey } from '../src/types/misc';

describe('experiment', () => {
	it('test', async () => {
		const server: Server = createServer({
			routes() {
				this.namespace = '/expense-tracker/api';
				this.get('/transactions', () => ['Hello World']);
			},
			timing: 0
		});

		try {
			const result = await searchForTransactions({
				startDate: defaultStartDate(),
				endDate: defaultEndDate(),
				pageNumber: 0,
				pageSize: 25,
				sortKey: TransactionSortKey.EXPENSE_DATE,
				sortDirection: SortDirection.DESC,
				confirmed: 'ALL',
				categorized: 'ALL',
				duplicate: 'ALL',
				possibleRefund: 'ALL'
			});
			console.log('RESULT', result);
		} catch (ex) {
			console.log(ex);
			throw ex;
		}
	});
});
