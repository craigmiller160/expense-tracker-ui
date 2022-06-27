import { Routes, Route } from 'solid-app-router';
import { namedLazy } from '../../utils/solidWrappers';
import { isAuthenticated } from '../../resources/AuthResources';

const Welcome = namedLazy(() => import('./Welcome'), 'Welcome');
const Categories = namedLazy(() => import('./Categories'), 'Categories');

// TODO need some kind of fallback route

export const AppRoutes = () => (
	<Routes>
		<Route path="/" element={<Welcome />} />
		<Route path="/welcome" element={<Welcome />} />
		{isAuthenticated() && (
			<Route path="/categories" element={<Categories />} />
		)}
	</Routes>
);
