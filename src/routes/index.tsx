import { ReactElement, Suspense } from 'react';
import { useGetAuthUser } from '../ajaxapi/query/AuthQueries';
import { match } from 'assert';
import { Navigate, RouteObject, useRoutes } from 'react-router';

interface RouteRules {
	readonly isAuthorized: boolean;
	readonly hasCheckedAuthorization: boolean;
}

const createRoutes = (rules: RouteRules): RouteObject[] => [
	{
		path: '/',
		element: <Navigate to="/expense-tracker" />
	}
];

export const useAppRoutes = (): ReactElement | null => {
	const {
		extra: { isAuthorized, hasCheckedAuthorization }
	} = useGetAuthUser();
	const routes = createRoutes({ isAuthorized, hasCheckedAuthorization });
	return useRoutes(routes);
};
