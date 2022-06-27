import { OptionT } from '@craigmiller160/ts-functions/es/types';
import { AuthUser } from '../../src/types/auth';
import produce from 'immer';
import { WritableDraft } from 'immer/dist/types/types-external';
import * as Option from 'fp-ts/es6/Option';

export interface Data {
	readonly authUser: OptionT<AuthUser>;
}

export type DataUpdater = (draft: WritableDraft<Data>) => void;

export class Database {
	data: Data = {
		authUser: Option.none
	};

	updateData(updater: DataUpdater) {
		this.data = produce(this.data, updater);
	}
}
