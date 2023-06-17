import { useAppRoutes } from '../../routes';
import { Alerts } from '../UI/Alerts';
import { PreContentLoading } from './PreContentLoading';

export const Content = () => {
	const Routes = useAppRoutes();
	return (
		<>
			<Alerts />
			<PreContentLoading>{Routes}</PreContentLoading>
		</>
	);
};
