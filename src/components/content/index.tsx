import Container from '@suid/material/Container';
import { Welcome } from './Welcome';
import { createSignal } from 'solid-js';
import { Temp } from './Temp';
import Button from '@suid/material/Button';

export const Content = () => {
	const [showTemp, setShowTemp] = createSignal(false);
	return (
		<Container>
			{showTemp() && <Temp />}
			<Button onClick={() => setShowTemp(true)}>Click</Button>
			<Welcome />
		</Container>
	);
};
