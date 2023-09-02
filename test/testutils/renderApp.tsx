import { render, RenderResult } from '@testing-library/react';
import { App } from '../../src/components/App';
import { Sleep } from '@craigmiller160/ts-functions';
import * as Task from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { BrowserRouter } from 'react-router-dom';
import {
	KeycloakAuth,
	KeycloakAuthContext
} from '@craigmiller160/react-keycloak';
import { newQueryClient } from '../../src/ajaxapi/query/queryClient';

interface RenderConfig {
	readonly initialPath?: string;
}

const keycloakAuth: KeycloakAuth = {
	status: 'authorized',
	isPostAuthorization: true,
	isPreAuthorization: false,
	logout: jest.fn()
};

export const renderApp = (config?: RenderConfig): Promise<RenderResult> => {
	window.history.replaceState({}, '', config?.initialPath ?? '/');
	const queryClient = newQueryClient();
	const result = render(
		<BrowserRouter basename="/">
			<KeycloakAuthContext.Provider value={keycloakAuth}>
				<App queryClient={queryClient} />
			</KeycloakAuthContext.Provider>
		</BrowserRouter>
	);
	return pipe(
		Sleep.sleep(100),
		Task.map(() => result)
	)();
};
