import {
	shouldSetParams,
	SyncFromParams,
	SyncToParams,
	useSearchParamSync
} from '../../src/routes/useSearchParamSync';
import { useImmer } from 'use-immer';
import { useCallback, useEffect } from 'react';
import { MemoryRouter, useSearchParams } from 'react-router-dom';
import { InitialEntry } from 'history';
import { useLocation } from 'react-router';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

type State = {
	readonly count: number;
};

type Dependencies = {
	readonly modifier: number;
};

const syncFromParams =
	(modifier: number): SyncFromParams<State> =>
	(params) => ({
		count: parseInt(params.get('count') ?? '0') + modifier
	});

const syncToParams: SyncToParams<State> = (state, params) => {
	params.set('count', state.count.toString());
};

const TestComponent = () => {
	const [state, setState] = useImmer<State>({
		count: 0
	});
	const [dependencies, setDependencies] = useImmer<Dependencies>({
		modifier: 0
	});
	const location = useLocation();
	const [, setSearchParams] = useSearchParams();

	const memoizedSyncFromParams = useCallback(
		(params: URLSearchParams) =>
			syncFromParams(dependencies.modifier)(params),
		[dependencies.modifier]
	);

	const [params, setParams] = useSearchParamSync<State>({
		syncFromParams: memoizedSyncFromParams,
		syncToParams
	});

	const incrementState = () =>
		setState((draft) => {
			draft.count++;
		});

	const incrementModifier = () =>
		setDependencies((draft) => {
			draft.modifier++;
		});

	const incrementSearch = () => {
		const newParams = new URLSearchParams(location.search);
		newParams.set('count', (state.count + 1).toString());
		setSearchParams(newParams);
	};

	useEffect(() => {
		setParams(state);
	}, [state, setParams]);

	useEffect(() => {
		setState(params);
	}, [params, setState]);

	return (
		<div>
			<p>State Count: {state.count}</p>
			<p>Params Count: {params.count}</p>
			<p>Search: {location.search}</p>
			<button onClick={incrementState}>Increment State</button>
			<button onClick={incrementSearch}>Increment Params</button>
			<button onClick={incrementModifier}>Increment Modifier</button>
		</div>
	);
};

const doRender = (initialEntry: InitialEntry) =>
	render(
		<MemoryRouter initialEntries={[initialEntry]}>
			<TestComponent />
		</MemoryRouter>
	);

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

	it('updates search params for state change', async () => {
		doRender('/');
		expect(screen.getByText(/State Count/)).toHaveTextContent(
			'State Count: 0'
		);
		expect(screen.getByText(/Params Count/)).toHaveTextContent(
			'Params Count: 0'
		);
		await waitFor(() =>
			expect(screen.getByText(/Search/)).toHaveTextContent(
				'Search: ?count=0'
			)
		);

		await userEvent.click(screen.getByText('Increment State'));
		await waitFor(() =>
			expect(screen.getByText(/Search/)).toHaveTextContent(
				'Search: ?count=1'
			)
		);
		expect(screen.getByText(/State Count/)).toHaveTextContent(
			'State Count: 1'
		);
		expect(screen.getByText(/Params Count/)).toHaveTextContent(
			'Params Count: 1'
		);
	});

	it('updates state for search params', async () => {
		doRender('/');
		expect(screen.getByText(/State Count/)).toHaveTextContent(
			'State Count: 0'
		);
		expect(screen.getByText(/Params Count/)).toHaveTextContent(
			'Params Count: 0'
		);
		await waitFor(() =>
			expect(screen.getByText(/Search/)).toHaveTextContent(
				'Search: ?count=0'
			)
		);

		await userEvent.click(screen.getByText('Increment Params'));
		expect(screen.getByText(/Search/)).toHaveTextContent(
			'Search: ?count=1'
		);
		expect(screen.getByText(/Params Count/)).toHaveTextContent(
			'Params Count: 1'
		);
		await waitFor(() =>
			expect(screen.getByText(/State Count/)).toHaveTextContent(
				'State Count: 1'
			)
		);
	});

	it('handles changing dependencies with sync management functions', () => {
		throw new Error();
	});
});
