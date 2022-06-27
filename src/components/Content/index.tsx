import Container from '@suid/material/Container';
import { useRoutes } from 'solid-app-router';
import { createRoutes } from '../../routes';

export const Content = () => {
	const Routes = useRoutes(createRoutes());
	return (
		<Container>
			<Routes />
		</Container>
	);
};
