import { RouteDefinition } from 'solid-app-router';
import { namedLazy } from '../utils/solidWrappers';

const welcomeRoute: RouteDefinition = {
	path: '/welcome',
	component: namedLazy(
		() => import('../components/Content/Welcome'),
		'Welcome'
	)
};

export const createRoutes = (): RouteDefinition[] => {
	return [welcomeRoute];
};
