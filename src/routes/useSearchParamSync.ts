import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router';

export type SyncFromParams<T> = (params: URLSearchParams) => T;
export type SyncToParams<T> = (value: T, params: URLSearchParams) => void;
export type DoSync<T> = (value: T) => void;

export type UseSearchParamSyncProps<T extends object> = {
	readonly syncFromParams: SyncFromParams<T>;
	readonly syncToParams: SyncToParams<T>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	readonly syncFromParamsDependencies?: ReadonlyArray<any>;
};

export const shouldSetParams = (
	baseParams: URLSearchParams,
	newParams: URLSearchParams
) => {
	const baseParamArray = Array.from(baseParams.entries());
	if (baseParamArray.length === 0) {
		return true;
	}
	return (
		baseParamArray.filter(([key, value]) => newParams.get(key) !== value)
			.length > 0
	);
};

export const useSearchParamSync = <T extends object>(
	props: UseSearchParamSyncProps<T>
): [T, DoSync<T>] => {
	const location = useLocation();
	const [searchParams, setSearchParams] = useSearchParams();
	const { syncFromParams, syncToParams, syncFromParamsDependencies } = props;

	const parsedSearchParams = useMemo(
		() => syncFromParams(searchParams),

		// eslint-disable-next-line react-hooks/exhaustive-deps
		[searchParams, syncFromParams, ...(syncFromParamsDependencies ?? [])]
	);

	const doSync: DoSync<T> = useCallback(
		(value) => {
			const baseParams = new URLSearchParams(location.search);
			const newParams = new URLSearchParams(location.search);
			syncToParams(value, newParams);
			if (shouldSetParams(baseParams, newParams)) {
				setSearchParams(newParams);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[setSearchParams, syncToParams]
	);

	return [parsedSearchParams, doSync];
};
