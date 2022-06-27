import { RouteDefinition } from 'solid-app-router';
import { namedLazy } from '../utils/solidWrappers';
import { Redirect } from '../components/UI/Redirect';
import { isAuthenticated } from '../resources/AuthResources';

const welcomeRoute: RouteDefinition = {
	path: '/welcome',
	component: namedLazy(
		() => import('../components/Content/Welcome'),
		'Welcome'
	)
};

const categoriesRoute: RouteDefinition = {
	path: '/categories',
	component: namedLazy(
		() => import('../components/Content/Categories'),
		'Categories'
	)
};

const catchAllRoute: RouteDefinition = {
	path: '*',
	component: () => <Redirect path="/welcome" />
};

export const createRoutes = (): RouteDefinition[] => {
	const isAuth = isAuthenticated();
	const categoriesRouteToUse = isAuth ? categoriesRoute : null;

	return [welcomeRoute, categoriesRouteToUse, catchAllRoute].filter(
		(route) => !!route
	) as RouteDefinition[];
};
