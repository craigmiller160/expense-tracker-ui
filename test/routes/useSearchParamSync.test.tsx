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
	readonly modify: boolean;
};

const syncFromParams =
	(modify: boolean): SyncFromParams<State> =>
	(params) => {
		let base = parseInt(params.get('count') ?? '0');
		if (modify && base % 2 !== 0) {
			base++;
		}
		return {
			count: base
		};
	};

const syncToParams: SyncToParams<State> = (state, params) => {
	params.set('count', state.count.toString());
};

const TestComponent = () => {
	const [state, setState] = useImmer<State>({
		count: 0
	});
	const [dependencies, setDependencies] = useImmer<Dependencies>({
		modify: false
	});
	const location = useLocation();
	const [, setSearchParams] = useSearchParams();

	const memoizedSyncFromParams = useCallback(
		(params: URLSearchParams) =>
			syncFromParams(dependencies.modify)(params),
		[dependencies.modify]
	);

	const [params, setParams] = useSearchParamSync<State>({
		syncFromParams: memoizedSyncFromParams,
		syncToParams
	});

	const incrementState = () =>
		setState((draft) => {
			draft.count++;
		});

	const enableModifier = () =>
		setDependencies((draft) => {
			draft.modify = true;
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
			<button onClick={enableModifier}>Enable Modifier</button>
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
		// TODO has loop
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

	it('preserves additional params when modifying', async () => {
		throw new Error();
	});

	it('handles changing dependencies with sync management functions', async () => {
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

		await userEvent.click(screen.getByText('Enable Modifier'));
		await waitFor(() =>
			expect(screen.getByText(/State Count/)).toHaveTextContent(
				'State Count: 2'
			)
		);
		expect(screen.getByText(/Search/)).toHaveTextContent(
			'Search: ?count=2'
		);
		expect(screen.getByText(/Params Count/)).toHaveTextContent(
			'Params Count: 2'
		);
	});
});
