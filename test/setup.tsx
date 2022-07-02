import { PropsWithChildren } from 'react';

beforeEach(() => {
	process.env.DEBUG_PRINT_LIMIT = '1000000000';
});

jest.mock('react', () => {
	const React = jest.requireActual('react');
	React.Suspense = ({ children }: PropsWithChildren) => children;
	return React;
});
