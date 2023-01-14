import { createContext, PropsWithChildren, useEffect } from 'react';
import Keycloak from 'keycloak-js';
import { BEARER_TOKEN_KEY } from '@craigmiller160/ajax-api';

export type KeycloakAuth = Record<string, never>;

const KeycloakAuthContext = createContext<KeycloakAuth>({});

const ACCESS_TOKEN_EXP_SECS = 300;

const keycloak = new Keycloak({
	url: 'https://auth-craigmiller160.ddns.net',
	// TODO this needs to be dynamic
	realm: 'apps-dev',
	clientId: 'expense-tracker-ui'
});

const handleKeycloakResult = (isSuccess: boolean) => {
	if (isSuccess && keycloak.token) {
		localStorage.setItem(BEARER_TOKEN_KEY, keycloak.token);
	} else {
		// TODO how to handle this?
	}
};

const initializeKeycloak = (): Promise<void> => {
	// TODO what about catch() in all of these?
	const promise = keycloak
		.init({ onLoad: 'login-required' })
		.then(handleKeycloakResult);

	setInterval(() => {
		keycloak
			.updateToken(ACCESS_TOKEN_EXP_SECS - 70)
			.then(handleKeycloakResult);
	}, (ACCESS_TOKEN_EXP_SECS - 60) * 1000);

	return promise;
};

export const KeycloakAuthProvider = (props: PropsWithChildren) => {
	useEffect(() => {
		initializeKeycloak();
	}, []);
	return (
		<KeycloakAuthContext.Provider value={{}}>
			{props.children}
		</KeycloakAuthContext.Provider>
	);
};
