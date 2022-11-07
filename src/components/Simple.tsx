// TODO delete this file
import { RouteObject, useLocation, useRoutes } from 'react-router';

const Base = () => {
	const location = useLocation();
	return (
		<div>
			<p>Base Component</p>
			<p>Path: {location.pathname}</p>
		</div>
	);
};

const Other = () => {
	const location = useLocation();
	return (
		<div>
			<p>Other Component</p>
			<p>Path: {location.pathname}</p>
		</div>
	);
};

const routes: RouteObject[] = [
	{
		path: '/',
		element: <Base />
	},
	{
		path: '/other',
		element: <Other />
	}
];

export const Simple = () => {
	const Routes = useRoutes(routes);
	return (
		<div>
			<p>Hello World</p>
			{Routes}
		</div>
	);
};
