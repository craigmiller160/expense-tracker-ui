import type { SyncToParams } from './useSearchParamSync';
import { useSearchParamSync } from './useSearchParamSync';
import type { Updater } from 'use-immer';
import { useImmer } from 'use-immer';
import type { Draft } from 'immer';
import { useCallback, useEffect } from 'react';
import type { ParamsWrapper } from './ParamsWrapper';

export type StateFromParams<State> = (
	draft: Draft<State>,
	params: ParamsWrapper<State>
) => void;

type Props<State extends object> = {
	readonly initialState: State;
	readonly stateFromParams: StateFromParams<State>;
	readonly stateToParams: SyncToParams<State>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	readonly stateToParamsDependencies?: ReadonlyArray<any>;
};

export const useImmerWithSearchParamSync = <State extends object>(
	props: Props<State>
): [State, Updater<State>] => {
	const { stateFromParams } = props;
	const [state, setState] = useImmer<State>(props.initialState);
	const syncFromParams = useCallback(
		(params: ParamsWrapper<State>) => {
			setState((draft) => stateFromParams(draft, params));
			// Return type will never be used, bypassing type system here
			return null as unknown as State;
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps, @typescript-eslint/no-unsafe-assignment
		[stateFromParams, setState, ...(props.stateToParamsDependencies ?? [])]
	);
	const [, setParams] = useSearchParamSync<State>({
		syncFromParams,
		syncToParams: props.stateToParams,
		syncFromParamsDependencies: props.stateToParamsDependencies
	});

	useEffect(() => {
		setParams(state);
	}, [state, setState, setParams]);

	return [state, setState];
};
