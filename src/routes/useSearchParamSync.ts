import { useSearchParams } from 'react-router-dom';
import { useCallback, useContext, useMemo } from 'react';
import { ParamsWrapper, wrapParams } from './ParamsWrapper';
import { NativeSearchProviderContext } from './NativeSearchProvider';

export type SyncFromParams<Params> = (params: ParamsWrapper<Params>) => Params;
export type SyncToParams<Params> = (
	value: Params,
	params: ParamsWrapper<Params>
) => void;
export type DoSync<Params> = (value: Params) => void;

export type UseSearchParamSyncProps<Params extends object> = {
	readonly syncFromParams: SyncFromParams<Params>;
	readonly syncToParams: SyncToParams<Params>;
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

export const useSearchParamSync = <Params extends object>(
	props: UseSearchParamSyncProps<Params>
): [Params, DoSync<Params>] => {
	const nativeSearchProvider = useContext(NativeSearchProviderContext);
	const [searchParams, setSearchParams] = useSearchParams();
	const { syncFromParams, syncToParams, syncFromParamsDependencies } = props;

	const parsedSearchParams = useMemo(
		() => syncFromParams(wrapParams(searchParams)),

		// eslint-disable-next-line react-hooks/exhaustive-deps
		[searchParams, syncFromParams, ...(syncFromParamsDependencies ?? [])]
	);

	const doSync: DoSync<Params> = useCallback(
		(value) => {
			// Using this as a solution to jsdom limitations for testing with window.location.search
			const nativeSearch =
				nativeSearchProvider?.() ?? window.location.search;
			const baseParams = new URLSearchParams(nativeSearch);
			const newParams = new URLSearchParams(nativeSearch);
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
