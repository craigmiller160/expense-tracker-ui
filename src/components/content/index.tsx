import Container from '@suid/material/Container';
import { Welcome } from './Welcome';
import { createSignal, lazy } from 'solid-js';
import Button from '@suid/material/Button';
import { namedLazy } from '../../utils/solidWrappers';

const Temp = namedLazy(() => import('./Temp'), 'Temp');

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
