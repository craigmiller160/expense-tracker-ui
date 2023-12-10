import { beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { constVoid } from 'fp-ts/function';
import { mswServer } from './msw-server';

beforeEach(() => {
	process.env.DEBUG_PRINT_LIMIT = '1000000000';
	mswServer.actions.resetServer();
});

let originalMatchMedia: (query: string) => MediaQueryList;

beforeAll(() => {
	mswServer.actions.startServer();
	originalMatchMedia = window.matchMedia;
	// add window.matchMedia
	// this is necessary for the date picker to be rendered in desktop mode.
	// if this is not provided, the mobile mode is rendered, which might lead to unexpected behavior
	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: (query: unknown) => ({
			media: query,
			// this is the media query that @material-ui/pickers uses to determine if a device is a desktop device
			matches: query === '(pointer: fine)',
			onchange: constVoid,
			addEventListener: constVoid,
			removeEventListener: constVoid,
			addListener: constVoid,
			removeListener: constVoid,
			dispatchEvent: () => false
		})
	});
});

afterAll(() => {
	mswServer.actions.stopServer();
	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: originalMatchMedia
	});
});

vi.mock('@craigmiller160/react-keycloak', async () => {
	const reactKeycloak = await vi.importActual<object>(
		'@craigmiller160/react-keycloak'
	);
	return {
		...reactKeycloak,
		KeycloakAuthProvider: null
	};
});
