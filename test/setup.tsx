import { PropsWithChildren } from 'react';

jest.mock('react', () => {
	const React = jest.requireActual('react');
	React.Suspense = ({ children }: PropsWithChildren) => children;
	return React;
});
