/// <reference types="vite/client" />

import { PropsWithChildren, useContext } from 'react';
import {
	KeycloakAuthContext,
	KeycloakAuthProvider,
	RequiredRoles
} from '@craigmiller160/react-keycloak';
import { BEARER_TOKEN_KEY } from '@craigmiller160/ajax-api';

const getRealm = (): string => {
	if (process.env.NODE_ENV !== 'test') {
		return import.meta.env.VITE_KEYCLOAK_REALM;
	}
	return '';
};

const requiredRoles: RequiredRoles = {
	client: {
		['expense-tracker-api']: ['access']
	}
};

const Explorer = (props: PropsWithChildren) => {
	const { status, error, tokenParsed } = useContext(KeycloakAuthContext);
	console.error('KEYCLOAK STATUS', status, error, tokenParsed);
	return <>{props.children}</>;
};

export const ExpenseTrackerKeycloakProvider = (props: PropsWithChildren) => (
	<KeycloakAuthProvider
		realm={getRealm()}
		clientId="expense-tracker-ui"
		localStorageKey={BEARER_TOKEN_KEY}
		requiredRoles={requiredRoles}
		doAccessDeniedRedirect={false}
	>
		<Explorer>{props.children}</Explorer>
	</KeycloakAuthProvider>
);
