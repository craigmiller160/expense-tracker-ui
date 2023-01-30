/// <reference types="vite/client" />

import { PropsWithChildren } from 'react';
import { KeycloakAuthProvider } from '@craigmiller160/react-keycloak';
import { BEARER_TOKEN_KEY } from '@craigmiller160/ajax-api';

const ACCESS_TOKEN_EXP_SECS = 300;

const getRealm = (): string => {
	if (process.env.NODE_ENV !== 'test') {
		return import.meta.env.VITE_KEYCLOAK_REALM;
	}
	return '';
};

export const ExpenseTrackerKeycloakProvider = (props: PropsWithChildren) => (
	<KeycloakAuthProvider
		accessTokenExpirationSecs={ACCESS_TOKEN_EXP_SECS}
		realm={getRealm()}
		authServerUrl="https://auth-craigmiller160.ddns.net/"
		clientId="expense-tracker-ui"
		bearerTokenLocalStorageKey={BEARER_TOKEN_KEY}
	>
		{props.children}
	</KeycloakAuthProvider>
);
