import { describe, it } from 'vitest';
import { createServer, Server } from 'miragejs';
import { searchForTransactions } from '../src/ajaxapi/service/TransactionService';
import {
	defaultEndDate,
	defaultStartDate
} from '../src/components/Content/Transactions/utils';
import { SortDirection, TransactionSortKey } from '../src/types/misc';
import axios from 'axios';

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
			const result = await axios.get('/expense-tracker/api/transactions');
			console.log(result.data);
			console.log('RESULT', result);
		} catch (ex) {
			console.log(ex);
			throw ex;
		}
	});
});
