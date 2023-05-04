import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';

export type SyncFromParams<T> = (params: URLSearchParams) => T;
export type SyncToParams<T> = (value: T) => URLSearchParams;
export type DoSync<T> = (value: T) => void;

export const useSearchParamSync = <T>(
	syncFromParams: SyncFromParams<T>,
	syncToParams: SyncToParams<T>
): [T, DoSync<T>] => {
	const [searchParams, setSearchParams] = useSearchParams();
	const parsedSearchParams = useMemo(
		() => syncFromParams(searchParams),
		[searchParams, syncFromParams]
	);
	const doSync: DoSync<T> = (value) => setSearchParams(syncToParams(value));

	return [parsedSearchParams, doSync];
};
