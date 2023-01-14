import { createContext, PropsWithChildren, useEffect } from 'react';
import Keycloak from 'keycloak-js';
import { BEARER_TOKEN_KEY } from '@craigmiller160/ajax-api';
import { Updater, useImmer } from 'use-immer';

export type KeycloakAuth = {
	readonly isAuthorized: boolean;
	readonly hasCheckedAuthorization: boolean;
};

const KeycloakAuthContext = createContext<KeycloakAuth>({
	isAuthorized: false,
	hasCheckedAuthorization: false
});

const ACCESS_TOKEN_EXP_SECS = 300;

const keycloak = new Keycloak({
	url: 'https://auth-craigmiller160.ddns.net',
	// TODO this needs to be dynamic
	realm: 'apps-dev',
	clientId: 'expense-tracker-ui'
});

const handleKeycloakResult =
	(updateAuth: Updater<KeycloakAuth>) => (isSuccess: boolean) => {
		if (isSuccess && keycloak.token) {
			localStorage.setItem(BEARER_TOKEN_KEY, keycloak.token);
		} else {
			console.error('NO SUCCESS');
			// TODO how to handle this?
		}
		updateAuth((draft) => {
			draft.hasCheckedAuthorization = true;
			draft.isAuthorized = isSuccess;
		});
	};

const initializeKeycloak = (
	updateAuth: Updater<KeycloakAuth>
): Promise<void> => {
	// TODO what about catch() in all of these?
	const promise = keycloak
		.init({ onLoad: 'login-required' })
		.then(handleKeycloakResult(updateAuth));

	setInterval(() => {
		keycloak
			.updateToken(ACCESS_TOKEN_EXP_SECS - 70)
			.then(handleKeycloakResult(updateAuth));
	}, (ACCESS_TOKEN_EXP_SECS - 60) * 1000);

	return promise;
};

export const KeycloakAuthProvider = (props: PropsWithChildren) => {
	const [state, setState] = useImmer<KeycloakAuth>({
		isAuthorized: false,
		hasCheckedAuthorization: false
	});
	useEffect(() => {
		initializeKeycloak(setState);
	}, [setState]);
	return (
		<KeycloakAuthContext.Provider value={state}>
			{props.children}
		</KeycloakAuthContext.Provider>
	);
};
