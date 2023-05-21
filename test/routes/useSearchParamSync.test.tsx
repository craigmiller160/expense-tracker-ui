import {
	shouldSetParams,
	SyncFromParams,
	SyncToParams,
	useSearchParamSync
} from '../../src/routes/useSearchParamSync';
import { useImmer } from 'use-immer';
import { useEffect } from 'react';

type State = {
	readonly count: number;
};

const syncFromParams: SyncFromParams<State> = (params) => ({
	count: parseInt(params.get('count') ?? '0')
});

const syncToParams: SyncToParams<State> = (state, params) => {
	params.set('count', state.count.toString());
};

const TestComponent = () => {
	const [state, setState] = useImmer<State>({
		count: 0
	});

	const [params, setParams] = useSearchParamSync<State>({
		syncFromParams,
		syncToParams
	});

	const increment = () =>
		setState((draft) => {
			draft.count++;
		});

	useEffect(() => {
		setParams(state);
	}, [state, setParams]);

	return (
		<div>
			<p>State Count: {state.count}</p>
			<p>Params Count: {params.count}</p>
			<button onClick={increment}>Increment</button>
		</div>
	);
};

describe('useSearchParamSync', () => {
	it('shouldSetParams', () => {
		const baseParams = new URLSearchParams();
		baseParams.set('hello', 'world');
		baseParams.set('goodbye', 'universe');
		const newParams = new URLSearchParams();
		newParams.set('hello', 'world');
		newParams.set('goodbye', 'galaxy');

		expect(shouldSetParams(baseParams, baseParams)).toEqual(false);
		expect(shouldSetParams(baseParams, newParams)).toEqual(true);
	});

	it('updates search params for state change', () => {
		throw new Error();
	});

	it('updates state for search params', () => {
		throw new Error();
	});
});
