import { Database } from '../Database';
import { Server } from 'miragejs/server';
import { pipe } from 'fp-ts/function';
import * as RArray from 'fp-ts/ReadonlyArray';
import * as Monoid from 'fp-ts/Monoid';
import {
	NeedsAttentionResponse,
	TransactionResponse
} from '../../../src/types/generated/expense-tracker';
import { MonoidT } from '@craigmiller160/ts-functions/es/types';
import { parseServerDate } from '../../../src/utils/dateTimeUtils';
import * as Time from '@craigmiller160/ts-functions/es/Time';

const getOldestDate = (
	dateString1: string | undefined,
	dateString2: string | undefined
): string | undefined => {
	if (dateString1 === undefined) {
		return dateString2;
	}

	if (dateString2 === undefined) {
		return undefined;
	}

	const date1 = parseServerDate(dateString1);
	const date2 = parseServerDate(dateString2);
	const comparison = Time.compare(date1)(date2);
	if (comparison >= 0) {
		return dateString1;
	}
	return dateString2;
};

const transactionToNeedsAttention = (
	transaction: TransactionResponse
): NeedsAttentionResponse => ({
	unconfirmed: {
		count: transaction.confirmed === false ? 1 : 0,
		oldest:
			transaction.confirmed === false
				? transaction.expenseDate
				: undefined
	},
	uncategorized: {
		count: transaction.categoryId ? 0 : 1,
		oldest: transaction.categoryId ? undefined : transaction.expenseDate
	},
	duplicate: {
		count: transaction.duplicate ? 1 : 0,
		oldest: transaction.duplicate ? transaction.expenseDate : undefined
	},
	possibleRefund: {
		count: transaction.amount > 0 ? 1 : 0,
		oldest: transaction.amount > 0 ? transaction.expenseDate : undefined
	}
});

const needsAttentionMonoid: MonoidT<NeedsAttentionResponse> = {
	empty: {
		unconfirmed: {
			count: 0,
			oldest: undefined
		},
		uncategorized: {
			count: 0,
			oldest: undefined
		},
		duplicate: {
			count: 0,
			oldest: undefined
		},
		possibleRefund: {
			count: 0,
			oldest: undefined
		}
	},
	concat: (res1, res2) => ({
		unconfirmed: {
			count: res1.unconfirmed.count + res2.unconfirmed.count,
			oldest: getOldestDate(
				res1.unconfirmed.oldest,
				res2.unconfirmed.oldest
			)
		},
		uncategorized: {
			count: res1.uncategorized.count + res2.uncategorized.count,
			oldest: getOldestDate(
				res1.uncategorized.oldest,
				res2.uncategorized.oldest
			)
		},
		duplicate: {
			count: res1.duplicate.count + res2.duplicate.count,
			oldest: getOldestDate(res1.duplicate.oldest, res2.duplicate.oldest)
		},
		possibleRefund: {
			count: res1.possibleRefund.count + res2.possibleRefund.count,
			oldest: getOldestDate(
				res1.possibleRefund.oldest,
				res2.possibleRefund.oldest
			)
		}
	})
};

export const createNeedsAttentionRoutes = (
	database: Database,
	server: Server
) => {
	server.get('/needs-attention', () => {
		return pipe(
			Object.values(database.data.transactions),
			RArray.map(transactionToNeedsAttention),
			Monoid.concatAll(needsAttentionMonoid)
		);
	});
};
