import { SyncToParams, useSearchParamSync } from './useSearchParamSync';
import { Updater, useImmer } from 'use-immer';
import { Draft } from 'immer';
import { useCallback, useEffect } from 'react';

export type StateFromParams<S> = (
	draft: Draft<S>,
	params: URLSearchParams
) => void;

type Props<S extends object> = {
	readonly initialState: S;
	readonly stateFromParams: StateFromParams<S>;
	readonly stateToParams: SyncToParams<S>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	readonly stateToParamsDependencies?: ReadonlyArray<any>;
};

export const useImmerWithSearchParamSync = <S extends object>(
	props: Props<S>
): [S, Updater<S>] => {
	const { stateFromParams } = props;
	const [state, setState] = useImmer<S>(props.initialState);
	const syncFromParams = useCallback(
		(params: URLSearchParams) => {
			setState((draft) => stateFromParams(draft, params));
			return state; // Return type doesn't matter here
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[stateFromParams]
	);
	const [, setParams] = useSearchParamSync<S>({
		syncFromParams,
		syncToParams: props.stateToParams,
		syncFromParamsDependencies: props.stateToParamsDependencies
	});

	useEffect(() => {
		setParams(state);
	}, [state, setState, setParams]);

	return [state, setState];
};
