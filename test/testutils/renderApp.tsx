import { vi } from 'vitest';
import { render, RenderResult } from '@testing-library/react';
import { App } from '../../src/components/App';
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
	logout: vi.fn()
};

export const renderApp = (config?: RenderConfig): RenderResult => {
	window.history.replaceState({}, '', config?.initialPath ?? '/');
	const queryClient = newQueryClient();
	return render(
		<BrowserRouter basename="/">
			<KeycloakAuthContext.Provider value={keycloakAuth}>
				<App queryClient={queryClient} />
			</KeycloakAuthContext.Provider>
		</BrowserRouter>
	);
};
