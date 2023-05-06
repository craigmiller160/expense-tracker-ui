import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';

export type SyncFromParams<T> = (params: URLSearchParams) => T;
export type SyncToParams<T> = (value: T) => URLSearchParams;
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
	const doSync: DoSync<T> = (value) =>
		setSearchParams(props.syncToParams(value));

	return [parsedSearchParams, doSync];
};
