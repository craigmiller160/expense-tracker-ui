import { render, RenderResult } from '@testing-library/react';
import { App } from '../../src/components/App';
import * as Sleep from '@craigmiller160/ts-functions/es/Sleep';
import * as Task from 'fp-ts/es6/Task';
import { pipe } from 'fp-ts/es6/function';
import { BrowserRouter } from 'react-router-dom';
import {
	KeycloakAuth,
	KeycloakAuthContext
} from '../../src/components/keycloak/KeycloakAuthContext';

interface RenderConfig {
	readonly initialPath?: string;
}

const keycloakAuth: KeycloakAuth = {
	isAuthorized: true,
	checkStatus: 'post-check',
	logout: jest.fn()
};

export const renderApp = (config?: RenderConfig): Promise<RenderResult> => {
	window.history.replaceState({}, '', config?.initialPath ?? '/');
	const result = render(
		<BrowserRouter basename="/">
			<KeycloakAuthContext.Provider value={keycloakAuth}>
				<App />
			</KeycloakAuthContext.Provider>
		</BrowserRouter>
	);
	return pipe(
		Sleep.sleep(100),
		Task.map(() => result)
	)();
};
