import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { ParamsWrapper, wrapParams } from './ParamsWrapper';

export type SyncFromParams<T> = (params: ParamsWrapper) => T;
export type SyncToParams<T> = (value: T, params: ParamsWrapper) => void;
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
	const newParamArray = Array.from(newParams.entries());
	if (
		baseParamArray.length === 0 ||
		baseParamArray.length !== newParamArray.length
	) {
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
	const [searchParams, setSearchParams] = useSearchParams();
	const { syncFromParams, syncToParams, syncFromParamsDependencies } = props;

	const parsedSearchParams = useMemo(
		() => syncFromParams(wrapParams(searchParams)),

		// eslint-disable-next-line react-hooks/exhaustive-deps
		[searchParams, syncFromParams, ...(syncFromParamsDependencies ?? [])]
	);

	const doSync: DoSync<T> = useCallback(
		(value) => {
			const baseParams = new URLSearchParams(searchParams);
			const newParams = new URLSearchParams(searchParams);
			syncToParams(value, wrapParams(newParams));
			if (shouldSetParams(baseParams, newParams)) {
				setSearchParams(newParams);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[setSearchParams, syncToParams]
	);

	return [parsedSearchParams, doSync];
};
