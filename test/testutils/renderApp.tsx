import { render, RenderResult } from '@testing-library/react';
import { App } from '../../src/components/App';
import * as Sleep from '@craigmiller160/ts-functions/es/Sleep';
import * as Task from 'fp-ts/es6/Task';
import { pipe } from 'fp-ts/es6/function';

interface RenderConfig {
	readonly initialPath?: string;
}

export const renderApp = (config?: RenderConfig): Promise<RenderResult> => {
	window.history.replaceState({}, '', config?.initialPath ?? '/');
	const result = render(<App />);
	return pipe(
		Sleep.sleep(100),
		Task.map(() => result)
	)();
};
