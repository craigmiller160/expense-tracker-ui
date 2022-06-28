import Container from '@suid/material/Container';
import { AppRoutes } from './AppRoutes';
import { hasCheckedAuthStatus } from '../../resources/AuthResources';

export const Content = () => (
	<Container>{hasCheckedAuthStatus() && <AppRoutes />}</Container>
);
