import { useContext } from 'react';
import { KeycloakAuthContext } from '../keycloak/KeycloakAuthProvider';

interface DerivedValues {
	readonly authButtonText: string;
	readonly authButtonAction: () => void;
	readonly isAuthorized: boolean;
	readonly hasCheckedAuthorization: boolean;
}

export const useDeriveNavbarFromAuthUser = (): DerivedValues => {
	const { isAuthorized, checkStatus, logout } =
		useContext(KeycloakAuthContext);
	const authButtonText = 'Logout';

	return {
		authButtonText,
		authButtonAction: logout,
		isAuthorized,
		hasCheckedAuthorization: checkStatus === 'post-check'
	};
};
