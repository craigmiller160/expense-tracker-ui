import { useAppRoutes } from '../../routes';
import { Alerts } from '../UI/Alerts';
import { useGetAllCategories } from '../../ajaxapi/query/CategoryQueries';

export const Content = () => {
	const Routes = useAppRoutes();
	useGetAllCategories(); // TODO delete this
	return (
		<>
			<Alerts />
			{Routes}
		</>
	);
};
