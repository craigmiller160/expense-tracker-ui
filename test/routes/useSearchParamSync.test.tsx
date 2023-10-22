import { describe, it, expect } from 'vitest';
import type {
	SyncFromParams,
	SyncToParams
} from '../../src/routes/useSearchParamSync';
import {
	shouldSetParams,
	useSearchParamSync
} from '../../src/routes/useSearchParamSync';
import { useImmer } from 'use-immer';
import { useCallback, useEffect } from 'react';
import { MemoryRouter, useSearchParams } from 'react-router-dom';
import { useLocation } from 'react-router';
import { render, screen, waitFor } from '@testing-library/react';
import userEvents from '@testing-library/user-event';
import type { ParamsWrapper } from '../../src/routes/ParamsWrapper';
import type { NativeSearchProvider } from '../../src/routes/NativeSearchProvider';
import { NativeSearchProviderContext } from '../../src/routes/NativeSearchProvider';

type State = {
	readonly count: number;
};

type Dependencies = {
	readonly modify: boolean;
};

const syncFromParams =
	(modify: boolean): SyncFromParams<State> =>
	(params) => {
		let base = params.getOrDefault('count', 0, parseInt);
		if (modify && base % 2 !== 0) {
			base++;
		}
		return {
			count: base
		};
	};

const syncToParams: SyncToParams<State> = (state, params) => {
	params.setOrDelete('count', state.count.toString());
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
		(params: ParamsWrapper<State>) =>
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

const QUERY_REGEX = /^.*(?<query>\?.*$)/;

const doRender = (initialEntry: string) => {
	const query = QUERY_REGEX.exec(initialEntry)?.groups?.query;
	const provider: NativeSearchProvider = () => query ?? '';
	return render(
		<MemoryRouter initialEntries={[initialEntry]}>
			<NativeSearchProviderContext.Provider value={provider}>
				<TestComponent />
			</NativeSearchProviderContext.Provider>
		</MemoryRouter>
	);
};

describe('useSearchParamSync', () => {
	describe('shouldSetParams', () => {
		it('has same params', () => {
			const params = new URLSearchParams();
			params.set('hello', 'world');
			params.set('goodbye', 'universe');
			expect(shouldSetParams(params, params)).toBe(false);
		});

		it('base params has more entries than new params', () => {
			const baseParams = new URLSearchParams();
			baseParams.set('hello', 'world');
			baseParams.set('goodbye', 'universe');
			baseParams.set('foo', 'bar');
			const newParams = new URLSearchParams();
			newParams.set('hello', 'world');
			newParams.set('goodbye', 'universe');
			expect(shouldSetParams(baseParams, newParams)).toBe(true);
		});

		it('new params has more entries than base params', () => {
			const baseParams = new URLSearchParams();
			baseParams.set('hello', 'world');
			baseParams.set('goodbye', 'universe');
			const newParams = new URLSearchParams();
			newParams.set('hello', 'world');
			newParams.set('goodbye', 'universe');
			newParams.set('foo', 'bar');
			expect(shouldSetParams(baseParams, newParams)).toBe(true);
		});

		it('param values are different', () => {
			const baseParams = new URLSearchParams();
			baseParams.set('hello', 'world');
			baseParams.set('goodbye', 'universe');
			const newParams = new URLSearchParams();
			newParams.set('hello', 'world');
			newParams.set('goodbye', 'galaxy');
			expect(shouldSetParams(baseParams, newParams)).toBe(true);
		});
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

		await userEvents.click(screen.getByText('Increment State'));
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

		await userEvents.click(screen.getByText('Increment Params'));
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
		doRender('/?other=hello');
		expect(screen.getByText(/State Count/)).toHaveTextContent(
			'State Count: 0'
		);
		expect(screen.getByText(/Params Count/)).toHaveTextContent(
			'Params Count: 0'
		);
		await waitFor(() =>
			expect(screen.getByText(/Search/)).toHaveTextContent(
				'Search: ?other=hello'
			)
		);

		await userEvents.click(screen.getByText('Increment Params'));
		await waitFor(() =>
			expect(screen.getByText(/Search/)).toHaveTextContent(
				'Search: ?other=hello&count=1'
			)
		);
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

		await userEvents.click(screen.getByText('Increment Params'));
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

		await userEvents.click(screen.getByText('Enable Modifier'));
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
