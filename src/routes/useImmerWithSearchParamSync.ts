import { SyncToParams, useSearchParamSync } from './useSearchParamSync';
import { useImmer } from 'use-immer';
import { Draft } from 'immer';
import { useCallback } from 'react';

export type StateFromParams<S> = (
	params: URLSearchParams,
	draft: Draft<S>
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
): [S, (s: S) => void] => {
	const { stateFromParams } = props;
	const [state, setState] = useImmer<S>(props.initialState);
	const syncFromParams = useCallback(
		(params: URLSearchParams) => {
			setState((draft) => stateFromParams(params, draft));
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

	return [state, setParams];
};
