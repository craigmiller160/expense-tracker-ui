import { useLocation } from 'react-router';
import { SyncToParams } from '../../src/routes/useSearchParamSync';
import {
	StateFromParams,
	useImmerWithSearchParamSync
} from '../../src/routes/useImmerWithSearchParamSync';
import { InitialEntry } from 'history';
import { render, screen, waitFor } from '@testing-library/react';
import userEvents from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

export {};

type State = {
	readonly count: number;
};

const stateToParams: SyncToParams<State> = (state, params) => {
	params.setOrDelete('count', state.count.toString());
};

const stateFromParams: StateFromParams<State> = (draft, params) => {
	draft.count = params.getOrDefault('count', 0, parseInt);
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
		expect(screen.getByText(/State Count/)).toHaveTextContent(
			'State Count: 0'
		);
		expect(screen.getByText(/Search/)).toHaveTextContent(
			'Search: ?count=0'
		);
	});

	it('updates state and search params', async () => {
		doRender('/');
		expect(screen.getByText(/State Count/)).toHaveTextContent(
			'State Count: 0'
		);
		expect(screen.getByText(/Search/)).toHaveTextContent(
			'Search: ?count=0'
		);
		await userEvents.click(screen.getByText('Increment'));
		await waitFor(() =>
			expect(screen.getByText(/State Count/)).toHaveTextContent(
				'State Count: 1'
			)
		);
		expect(screen.getByText(/Search/)).toHaveTextContent(
			'Search: ?count=1'
		);
	});

	it('updates state for initial params values', () => {
		doRender('/?count=12');
		expect(screen.getByText(/State Count/)).toHaveTextContent(
			'State Count: 12'
		);
		expect(screen.getByText(/Search/)).toHaveTextContent(
			'Search: ?count=12'
		);
	});
});
