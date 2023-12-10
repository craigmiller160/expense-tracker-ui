/// <reference types="vite/client" />

import type { PropsWithChildren } from 'react';
import type { RequiredRoles } from '@craigmiller160/react-keycloak';
import { KeycloakAuthProvider } from '@craigmiller160/react-keycloak';
import { BEARER_TOKEN_KEY } from '@craigmiller160/ajax-api';

const getRealm = (): string => {
	if (process.env.NODE_ENV !== 'test') {
		return import.meta.env.VITE_KEYCLOAK_REALM as string;
	}
	return '';
};

const requiredRoles: RequiredRoles = {
	client: {
		['expense-tracker-api']: ['access']
	}
};

export const ExpenseTrackerKeycloakProvider = (props: PropsWithChildren) => (
	<KeycloakAuthProvider
		realm={getRealm()}
		clientId="expense-tracker-ui"
		localStorageKey={BEARER_TOKEN_KEY}
		requiredRoles={requiredRoles}
	>
		{props.children}
	</KeycloakAuthProvider>
);
