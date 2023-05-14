import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

export type SyncFromParams<T> = (params: URLSearchParams) => T;
export type SyncToParams<T> = (value: T, params: URLSearchParams) => void;
export type DoSync<T> = (value: T) => void;

export type UseSearchParamSyncProps<T extends object> = {
	readonly syncFromParams: SyncFromParams<T>;
	readonly syncToParams: SyncToParams<T>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	readonly syncFromParamsDependencies?: ReadonlyArray<any>;
};

export const useSearchParamSync = <T extends object>(
	props: UseSearchParamSyncProps<T>
): [T, DoSync<T>] => {
	const [searchParams, setSearchParams] = useSearchParams();
	const parsedSearchParams = useMemo(
		() => {
			return props.syncFromParams(searchParams);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[searchParams, ...(props.syncFromParamsDependencies ?? [])]
	);
	const doSync: DoSync<T> = useCallback(
		(value) => {
			const newParams = new URLSearchParams(searchParams);
			props.syncToParams(value, newParams);
			setSearchParams(newParams);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[setSearchParams]
	);

	return [parsedSearchParams, doSync];
};
