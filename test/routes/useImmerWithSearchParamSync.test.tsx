import { useLocation } from 'react-router';
import { SyncToParams } from '../../src/routes/useSearchParamSync';
import {
	StateFromParams,
	useImmerWithSearchParamSync
} from '../../src/routes/useImmerWithSearchParamSync';
import { InitialEntry } from 'history';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

export {};

type State = {
	readonly count: number;
};

const stateToParams: SyncToParams<State> = (state, params) => {
	params.set('count', state.count.toString());
};

const stateFromParams: StateFromParams<State> = (draft, params) => {
	draft.count = parseInt(params.get('count') ?? '0');
};

const TestComponent = () => {
	const location = useLocation();
	const [state, setState] = useImmerWithSearchParamSync<State>({
		stateToParams,
		stateFromParams,
		initialState: {
			count: 0
		}
	});

	const increment = () =>
		setState((draft) => {
			draft.count++;
		});

	return (
		<div>
			<p>State Count: {state.count}</p>
			<p>Search: {location.search}</p>
			<button onClick={increment}>Increment</button>
		</div>
	);
};

const doRender = (initialEntry: InitialEntry) =>
	render(
		<MemoryRouter initialEntries={[initialEntry]}>
			<TestComponent />
		</MemoryRouter>
	);

describe('useImmerWithSearchParamSync', () => {
	it('sets initial state in state and search params', () => {
		doRender('/');
		throw new Error();
	});

	it('updates state and search params', () => {
		doRender('/');
		throw new Error();
	});

	it('updates state for initial params values', () => {
		doRender('/?count=12');
		throw new Error();
	});
});
