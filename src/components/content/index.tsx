import Container from '@suid/material/Container';
import { Welcome } from './Welcome';
import { createSignal, lazy } from 'solid-js';
import Button from '@suid/material/Button';

const Temp = lazy(() =>
	import('./Temp').then((res) => ({
		default: res.Temp
	}))
);

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
