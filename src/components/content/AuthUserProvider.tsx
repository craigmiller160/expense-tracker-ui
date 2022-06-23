import { createContext, ParentProps, Resource } from 'solid-js';
import { AuthUser } from '../../types/auth';
import { getAuthUser } from '../../services/AuthService';

export interface AuthUserContextValue {
	readonly authUser: Resource<AuthUser | undefined>;
	readonly hasChecked: () => boolean;
	readonly isAuthorized: () => boolean;
}

export const AuthUserContext = createContext<AuthUserContextValue>();

export const AuthUserProvider = (props: ParentProps) => {
	const [authUser] = getAuthUser();
	const value: AuthUserContextValue = {
		authUser,
		hasChecked: () => !authUser.loading || authUser.error,
		isAuthorized: () => authUser() !== undefined
	};
	return (
		<AuthUserContext.Provider value={value}>
			{props.children}
		</AuthUserContext.Provider>
	);
};
