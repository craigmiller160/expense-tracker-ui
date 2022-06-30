import { render, RenderResult } from '@testing-library/react';
import { App } from '../../src/components/App';

interface RenderConfig {
	readonly initialPath?: string;
}

export const renderApp = (config?: RenderConfig): RenderResult => {
	window.history.replaceState({}, '', config?.initialPath ?? '/');
	return render(<App />);
};
