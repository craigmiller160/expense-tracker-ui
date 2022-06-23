import Container from '@suid/material/Container';
import { AuthUserProvider } from './AuthUserProvider';

export const Content = () => {
	return (
		<AuthUserProvider>
			<Container>
				<h1>Root</h1>
			</Container>
		</AuthUserProvider>
	);
};
