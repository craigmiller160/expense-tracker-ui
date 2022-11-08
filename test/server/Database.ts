import { OptionT } from '@craigmiller160/ts-functions/es/types';
import produce from 'immer';
import { WritableDraft } from 'immer/dist/types/types-external';
import * as Option from 'fp-ts/es6/Option';
import { DbRecord } from '../../src/types/db';
import { nanoid } from 'nanoid';
import {
	AuthUserDto,
	CategoryResponse,
	TransactionDetailsResponse
} from '../../src/types/generated/expense-tracker';

export const USER_ID = 1;

export interface Data {
	readonly authUser: OptionT<AuthUserDto>;
	readonly categories: Record<string, CategoryResponse>;
	readonly transactions: Record<string, TransactionDetailsResponse>;
}

export type DataUpdater = (draft: WritableDraft<Data>) => void;

export const ensureDbRecord = <T extends object>(record: T): T & DbRecord => {
	if (
		Object.prototype.hasOwnProperty.call(record, 'id') &&
		(record as DbRecord).id
	) {
		return record as T & DbRecord;
	}
	return {
		...record,
		id: nanoid()
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
