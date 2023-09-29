import { types } from '@craigmiller160/ts-functions';
import produce, { Draft } from 'immer';
import * as Option from 'fp-ts/Option';
import { DbRecord } from '../../src/types/db';
import { v4 as uuidv4 } from 'uuid';
import {
	CategoryResponse,
	TransactionDetailsResponse
} from '../../src/types/generated/expense-tracker';

export interface Data {
	readonly authUser: types.OptionT<string>;
	readonly categories: Record<string, CategoryResponse>;
	readonly transactions: Record<string, TransactionDetailsResponse>;
}

export type DataUpdater = (draft: Draft<Data>) => void;

export const ensureDbRecord = <T extends object>(record: T): T & DbRecord => {
	if (
		Object.prototype.hasOwnProperty.call(record, 'id') &&
		(record as DbRecord).id
	) {
		return record as T & DbRecord;
	}
	return {
		...record,
		id: uuidv4()
	};
};

export class Database {
	data: Data = {
		authUser: Option.none,
		categories: {},
		transactions: {}
	};

	updateData(updater: DataUpdater) {
		this.data = produce(this.data, updater);
	}
}
