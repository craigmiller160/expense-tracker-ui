import { createContext, ParentProps, Resource } from 'solid-js';
import { AuthUser } from '../../types/auth';
import { getAuthUser } from '../../services/AuthService';

export interface AuthUserContextValue {
	readonly authUser: Resource<AuthUser | undefined>;
}

export const AuthUserContext = createContext<AuthUserContextValue>();

export const AuthUserProvider = (props: ParentProps) => {
	const [authUser] = getAuthUser();
	return (
		<AuthUserContext.Provider value={{ authUser }}>
			{props.children}
		</AuthUserContext.Provider>
	);
};
