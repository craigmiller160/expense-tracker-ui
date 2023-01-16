/// <reference types="vite/client" />
import { createContext, PropsWithChildren, useEffect } from 'react';
import Keycloak from 'keycloak-js';
import { BEARER_TOKEN_KEY } from '@craigmiller160/ajax-api';
import { Updater, useImmer } from 'use-immer';

type CheckStatus = 'pre-check' | 'checking' | 'post-check';

type KeycloakState = {
	readonly isAuthorized: boolean;
	readonly checkStatus: CheckStatus;
};
export type KeycloakAuth = KeycloakState & {
	readonly logout: () => void;
};

const ACCESS_TOKEN_EXP_SECS = 300;

const getRealm = (): string => {
	if (process.env.NODE_ENV !== 'test') {
		return import.meta.env.VITE_KEYCLOAK_REALM;
	}
	return '';
};

const keycloak = new Keycloak({
	url: 'https://auth-craigmiller160.ddns.net/',
	realm: getRealm(),
	clientId: 'expense-tracker-ui'
});
const logout = () => keycloak.logout();

export const KeycloakAuthContext = createContext<KeycloakAuth>({
	isAuthorized: false,
	checkStatus: 'pre-check',
	logout
});

const handleKeycloakResult =
	(updateAuth: Updater<KeycloakState>) => (isSuccess: boolean) => {
		if (isSuccess && keycloak.token) {
			localStorage.setItem(BEARER_TOKEN_KEY, keycloak.token);
		}
		updateAuth((draft) => {
			draft.checkStatus = 'post-check';
			draft.isAuthorized = isSuccess;
		});
	};

const initializeKeycloak = (
	updateAuth: Updater<KeycloakState>
): Promise<void> => {
	const promise = keycloak
		.init({ onLoad: 'login-required' })
		.then(handleKeycloakResult(updateAuth))
		.catch((ex) => console.error('Keycloak Authentication Error', ex));

	setInterval(() => {
		keycloak
			.updateToken(ACCESS_TOKEN_EXP_SECS - 70)
			.then(handleKeycloakResult(updateAuth))
			.catch((ex) => console.error('Keycloak Refresh Error', ex));
	}, (ACCESS_TOKEN_EXP_SECS - 60) * 1000);

	return promise;
};

export const KeycloakAuthProvider = (props: PropsWithChildren) => {
	const [state, setState] = useImmer<KeycloakState>({
		isAuthorized: false,
		checkStatus: 'pre-check'
	});
	useEffect(() => {
		if (state.checkStatus === 'pre-check') {
			setState((draft) => {
				draft.checkStatus = 'checking';
			});
		} else if (state.checkStatus === 'checking') {
			initializeKeycloak(setState);
		}
	}, [setState, state.checkStatus]);

	const authValue = {
		...state,
		logout
	};

	return (
		<KeycloakAuthContext.Provider value={authValue}>
			{props.children}
		</KeycloakAuthContext.Provider>
	);
};
