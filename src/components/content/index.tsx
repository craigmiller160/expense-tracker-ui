import Container from '@suid/material/Container';
import { AuthUserProvider } from './AuthUserProvider';
import { Welcome } from './Welcome';

export const Content = () => {
	return (
		<AuthUserProvider>
			<Container>
				<Welcome />
			</Container>
		</AuthUserProvider>
	);
};
