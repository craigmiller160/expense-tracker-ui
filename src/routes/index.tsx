import { ReactElement } from 'react';
import { useGetAuthUser } from '../ajaxapi/query/AuthQueries';
import { Navigate, RouteObject, useRoutes } from 'react-router';
import { namedLazy } from '../utils/reactWrappers';
import { match } from 'ts-pattern';
import { LazySuspenseWrapper } from '../components/UI/LazySuspenseWrapper';

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

interface RouteRules {
	readonly isAuthorized: boolean;
	readonly hasCheckedAuthorization: boolean;
}

const createAuthorizedRoutes = (): RouteObject[] => [
	{
		path: '',
		element: <Navigate to="transactions" />
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
		path: '*',
		element: <Navigate to="transactions" />
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
		element: <Navigate to="/expense-tracker" />
	},
	{
		path: '/expense-tracker',
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
	const {
		extra: { isAuthorized, hasCheckedAuthorization }
	} = useGetAuthUser();
	const routes = createRoutes({ isAuthorized, hasCheckedAuthorization });
	return useRoutes(routes);
};
