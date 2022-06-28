import { render } from 'solid-js/web';
import { App } from './components/App';

const dispose = render(
	() => <App />,
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	document.getElementById('root')!
);
if (import.meta.hot) {
	import.meta.hot.dispose(dispose);
}
