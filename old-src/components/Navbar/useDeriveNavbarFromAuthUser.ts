import { match } from 'ts-pattern';
import { useGetAuthUser } from '../../../src/api/query/AuthQueries';
import { QueryStatus } from 'react-query';
import { login, logout } from '../../services/AuthService';

interface DerivedFromAuthUser<T> {
	readonly loading: T;
	readonly failed: T;
	readonly succeeded: T;
}

interface DerivedValues {
	readonly authButtonText: string;
	readonly authButtonAction: () => Promise<unknown>;
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

const getAuthButtonAction = deriveFromAuthUser<() => Promise<unknown>>({
	loading: () => Promise.resolve(),
	failed: login,
	succeeded: logout
});

export const useDeriveNavbarFromAuthUser = (): DerivedValues => {
	const { status } = useGetAuthUser();
	const authButtonText = getAuthButtonText(status);
	const authButtonAction = getAuthButtonAction(status);

	return {
		authButtonText,
		authButtonAction
	};
};
