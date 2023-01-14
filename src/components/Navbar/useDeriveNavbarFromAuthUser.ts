import { useContext } from 'react';
import { KeycloakAuthContext } from '../KeycloakAuthProvider';

interface DerivedValues {
	readonly authButtonText: string;
	readonly authButtonAction: () => Promise<unknown>;
	readonly isAuthorized: boolean;
	readonly hasCheckedAuthorization: boolean;
}

export const useDeriveNavbarFromAuthUser = (): DerivedValues => {
	const { isAuthorized, hasCheckedAuthorization } =
		useContext(KeycloakAuthContext);
	const authButtonText = 'Logout';
	// const authButtonAction = getAuthButtonAction(refetch)(status);

	return {
		authButtonText,
		// TODO fix this for logout
		authButtonAction: () => Promise.resolve(),
		isAuthorized,
		hasCheckedAuthorization
	};
};
