import type { UseQueryResult } from '@tanstack/react-query';

export interface QueryHookResult<T, R = undefined> {
	readonly result: UseQueryResult<T, Error>;
	readonly extra: R;
}
