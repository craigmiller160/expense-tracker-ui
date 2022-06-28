import { Routes, Route } from 'solid-app-router';
import { namedLazy } from '../../utils/solidWrappers';
import { isAuthenticated } from '../../resources/AuthResources';
import { Redirect } from '../UI/Redirect';

const Welcome = namedLazy(() => import('./Welcome'), 'Welcome');
const Categories = namedLazy(() => import('./Categories'), 'Categories');

export const AppRoutes = () => (
	<Routes>
		<Route path="/welcome" element={<Welcome />} />
		{isAuthenticated() && (
			<Route path="/categories" element={<Categories />} />
		)}
		<Route path="*" element={<Redirect path="/welcome" />} />
	</Routes>
);
