import { createContext, PropsWithChildren } from 'react';

export type KeycloakAuth = Record<string, never>;

const KeycloakAuthContext = createContext<KeycloakAuth>({});

export const KeycloakAuthProvider = (props: PropsWithChildren) => {
	return (
		<KeycloakAuthContext.Provider value={{}}>
			{props.children}
		</KeycloakAuthContext.Provider>
	);
};
