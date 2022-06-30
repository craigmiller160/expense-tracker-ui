import { ApiServer, newApiServer } from '../../../server';
import { renderApp } from '../../../testutils/renderApp';
import { waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';

jest.mock('react', () => {
	const React = jest.requireActual('react');
	React.Suspense = ({ children }) => children;
	return React;
});

describe('Manage Categories', () => {
	let apiServer: ApiServer;
	beforeEach(() => {
		apiServer = newApiServer();
	});

	afterEach(() => {
		apiServer.server.shutdown();
	});
	it('displays all categories on sever', async () => {
		renderApp({
			initialPath: '/expense-tracker/categories'
		});
		await waitFor(() =>
			expect(screen.queryAllByText('Manage Categories')).toHaveLength(2)
		);
	});

	it('adds new category', async () => {
		renderApp({
			initialPath: '/expense-tracker/categories'
		});
		throw new Error();
	});

	it('updates category name', async () => {
		renderApp({
			initialPath: '/expense-tracker/categories'
		});
		throw new Error();
	});

	it('deletes category', async () => {
		renderApp({
			initialPath: '/expense-tracker/categories'
		});
		throw new Error();
	});
});
