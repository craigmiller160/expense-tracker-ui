import { match } from 'ts-pattern';
import { useGetAuthUser } from '../../ajaxapi/query/AuthQueries';
import { QueryStatus } from 'react-query';
import { login, logout } from '../../ajaxapi/service/AuthService';

interface DerivedFromAuthUser<T> {
	readonly loading: T;
	readonly failed: T;
	readonly succeeded: T;
}

interface DerivedValues {
	readonly authButtonText: string;
	readonly authButtonAction: () => Promise<unknown>;
	readonly isAuthorized: boolean;
	readonly hasCheckedAuthorization: boolean;
}

const deriveFromAuthUser =
	<T>(derived: DerivedFromAuthUser<T>) =>
	(status: QueryStatus): T =>
		match(status)
			.with('error', () => derived.failed)
			.with('success', () => derived.succeeded)
			.otherwise(() => derived.loading);

const getAuthButtonText = deriveFromAuthUser({
	loading: '',
	failed: 'Login',
	succeeded: 'Logout'
});

const getAuthButtonAction = (refetch: () => Promise<unknown>) =>
	deriveFromAuthUser<() => Promise<unknown>>({
		loading: () => Promise.resolve(),
		failed: login,
		succeeded: () => logout().then(refetch)
	});

export const useDeriveNavbarFromAuthUser = (): DerivedValues => {
	const {
		result: { status, refetch },
		extra: { isAuthorized, hasCheckedAuthorization }
	} = useGetAuthUser();
	const authButtonText = getAuthButtonText(status);
	const authButtonAction = getAuthButtonAction(refetch)(status);

	return {
		authButtonText,
		authButtonAction,
		isAuthorized,
		hasCheckedAuthorization
	};
};
