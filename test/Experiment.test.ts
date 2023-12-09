import { test } from 'vitest';
import axios from 'axios';

test('experiment', async () => {
	try {
		const res = await axios.post(
			'/expense-tracker/api/transaction-import?type=CHASE_CSV'
		);
		console.log(res.data);
	} catch (ex) {
		console.error(ex);
	}
});
