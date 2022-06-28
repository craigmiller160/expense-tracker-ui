import { ReactElement, Suspense } from 'react';
import { useGetAuthUser } from '../ajaxapi/query/AuthQueries';
import { Navigate, RouteObject, useRoutes } from 'react-router';
import { namedLazy } from '../utils/reactWrappers';
import { match } from 'ts-pattern';

// TODO need a better fallback
const Fallback = () => <></>;

const Welcome = namedLazy(
	() => import('../components/Content/Welcome'),
	'Welcome'
);
const SuspenseWelcome = () => (
	<Suspense fallback={<Fallback />}>
		<Welcome />
	</Suspense>
);
const Categories = namedLazy(
	() => import('../components/Content/Categories'),
	'Categories'
);
const SuspenseCategories = () => (
	<Suspense fallback={<Fallback />}>
		<Categories />
	</Suspense>
);

interface RouteRules {
	readonly isAuthorized: boolean;
	readonly hasCheckedAuthorization: boolean;
}

const createAuthorizedRoutes = (): RouteObject[] => [
	{
		path: 'welcome',
		element: <SuspenseWelcome />
	},
	{
		path: '',
		element: <Navigate to="welcome" />
	},
	{
		path: 'categories',
		element: <SuspenseCategories />
	},
	{
		path: '*',
		element: <Navigate to="welcome" />
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
