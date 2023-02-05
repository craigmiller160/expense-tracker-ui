import { useContext } from 'react';
import { KeycloakAuthContext } from '@craigmiller160/react-keycloak';

interface DerivedValues {
	readonly authButtonText: string;
	readonly authButtonAction: () => void;
	readonly isAuthorized: boolean;
	readonly hasCheckedAuthorization: boolean;
}

export const useDeriveNavbarFromAuthUser = (): DerivedValues => {
	const { status, logout } = useContext(KeycloakAuthContext);
	const authButtonText = 'Logout';

	return {
		authButtonText,
		authButtonAction: logout,
		isAuthorized: status === 'authorized',
		hasCheckedAuthorization: status !== 'authorizing'
	};
};
