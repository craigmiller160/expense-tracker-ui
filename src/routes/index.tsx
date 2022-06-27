import { RouteDefinition } from 'solid-app-router';
import { namedLazy } from '../utils/solidWrappers';
import { Redirect } from '../components/UI/Redirect';

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
	return [welcomeRoute, categoriesRoute, catchAllRoute];
};
