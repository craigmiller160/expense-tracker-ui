import { type ReactElement, useMemo } from 'react';
import { useContext } from 'react';
import type { RouteObject } from 'react-router';
import { Navigate, useRoutes } from 'react-router';
import { namedLazy } from '../utils/reactWrappers';
import { match } from 'ts-pattern';
import { LazySuspenseWrapper } from '../components/UI/LazySuspenseWrapper';
import type { KeycloakAuth } from '@craigmiller160/react-keycloak';
import { KeycloakAuthContext } from '@craigmiller160/react-keycloak';

const Welcome = namedLazy(
	() => import('../components/Content/Welcome'),
	'Welcome'
);
const Categories = namedLazy(
	() => import('../components/Content/Categories'),
	'Categories'
);
const Import = namedLazy(
	() => import('../components/Content/Import'),
	'Import'
);
const Transactions = namedLazy(
	() => import('../components/Content/Transactions'),
	'Transactions'
);
const Rules = namedLazy(() => import('../components/Content/Rules'), 'Rules');
interface RouteRules {
	readonly isAuthorized: boolean;
	readonly hasCheckedAuthorization: boolean;
}

const Reports = namedLazy(
	() => import('../components/Content/Reports'),
	'Reports'
);

const createAuthorizedRoutes = (): RouteObject[] => [
	{
		path: '',
		element: <Navigate to="reports" />
	},
	{
		path: 'categories',
		element: <LazySuspenseWrapper component={Categories} />
	},
	{
		path: 'import',
		element: <LazySuspenseWrapper component={Import} />
	},
	{
		path: 'transactions',
		element: <LazySuspenseWrapper component={Transactions} />
	},
	{
		path: 'reports',
		element: <LazySuspenseWrapper component={Reports} />
	},
	{
		path: 'rules',
		element: <LazySuspenseWrapper component={Rules} />
	},
	{
		path: '*',
		element: <Navigate to="reports" />
	}
];

const createUnauthorizedRoutes = (): RouteObject[] => [
	{
		path: 'welcome',
		element: <Welcome />
	},
	{
		path: '',
		element: <Navigate to="welcome" />
	},
	{
		path: '*',
		element: <Navigate to="welcome" />
	}
];

const createPreAuthorizeRoutes = (): RouteObject[] => [
	{
		path: '',
		element: <div />
	},
	{
		path: '*',
		element: <div />
	}
];

const createRoutes = (rules: RouteRules): RouteObject[] => [
	{
		path: '/',
		element: <Navigate to="/reports" />
	},
	{
		path: '/',
		children: match(rules)
			.with(
				{ isAuthorized: true, hasCheckedAuthorization: true },
				createAuthorizedRoutes
			)
			.with(
				{ isAuthorized: false, hasCheckedAuthorization: true },
				createUnauthorizedRoutes
			)
			.otherwise(createPreAuthorizeRoutes)
	}
];

export const useAppRoutes = (): ReactElement | null => {
	const { status, isPostAuthorization } =
		useContext<KeycloakAuth>(KeycloakAuthContext);
	const routes = useMemo(
		() =>
			createRoutes({
				isAuthorized: status === 'authorized',
				hasCheckedAuthorization: isPostAuthorization
			}),
		[status, isPostAuthorization]
	);
	return useRoutes(routes);
};
