import { PropsWithChildren } from 'react';
import { constVoid } from 'fp-ts/es6/function';
import { apiServer } from './server';

beforeEach(() => {
	process.env.DEBUG_PRINT_LIMIT = '1000000000';
	apiServer.actions.setInitialData();
});

jest.mock('react', () => {
	const React = jest.requireActual('react');
	React.Suspense = ({ children }: PropsWithChildren) => children;
	return React;
});

let originalMatchMedia: (query: string) => MediaQueryList;

beforeAll(() => {
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
	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: originalMatchMedia
	});
});
