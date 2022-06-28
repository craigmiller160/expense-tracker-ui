import { useAppRoutes } from '../../routes';
import { Alerts } from '../UI/Alerts';

export const Content = () => {
	const Routes = useAppRoutes();
	return (
		<>
			<Alerts />
			{Routes}
		</>
	);
};
