import { RouteDefinition } from 'solid-app-router';
import { namedLazy } from '../utils/solidWrappers';

export const createRoutes = (): RouteDefinition[] => {
	return [
		{
			path: '/welcome',
			component: namedLazy(
				() => import('../components/Content/Welcome'),
				'Welcome'
			)
		}
	];
};
