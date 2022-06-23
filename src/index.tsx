import { render } from 'solid-js/web';

const dispose = render(
	() => <h1>Hello World</h1>,
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	document.getElementById('root')!
);
if (import.meta.hot) {
	import.meta.hot.dispose(dispose);
}
