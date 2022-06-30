import { ApiServer, newApiServer } from '../../../server';
import { renderApp } from '../../../testutils/renderApp';
import { waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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
		expect(screen.queryByText('Name')).toBeVisible();
		expect(screen.queryByText('Actions')).toBeVisible();
		expect(screen.queryByText('Add')).toBeVisible();
		await waitFor(() =>
			expect(screen.queryAllByText('Details')).toHaveLength(3)
		);
		expect(screen.queryByText('Groceries')).toBeVisible();
		expect(screen.queryByText('Restaurants')).toBeVisible();
		expect(screen.queryByText('Entertainment')).toBeVisible();
	});

	it('adds new category', async () => {
		renderApp({
			initialPath: '/expense-tracker/categories'
		});
		await waitFor(() =>
			expect(screen.queryAllByText('Manage Categories')).toHaveLength(2)
		);
		userEvent.click(screen.getByText('Add'));
		await waitFor(() =>
			expect(screen.queryByText('New Category')).toBeVisible()
		);
		expect(screen.queryByDisplayValue('New Category')).toBeVisible();
		// TODO clean this up
		fireEvent.change(screen.getByTestId('name-field'), {
			target: {
				// @ts-ignore
				value: 'Abc'
			}
		});
		await waitFor(() =>
			expect(screen.getByDisplayValue('Abc')).toBeVisible()
		);
		userEvent.click(screen.getByText('Save'));

		await waitFor(() => expect(screen.queryByText('Abc')).toBeVisible());
		expect(screen.queryByText('New Category')).not.toBeInTheDocument();
	});

	it('updates category name', async () => {
		renderApp({
			initialPath: '/expense-tracker/categories'
		});
		await waitFor(() =>
			expect(screen.queryAllByText('Manage Categories')).toHaveLength(2)
		);
		throw new Error();
	});

	it('deletes category', async () => {
		renderApp({
			initialPath: '/expense-tracker/categories'
		});
		await waitFor(() =>
			expect(screen.queryAllByText('Manage Categories')).toHaveLength(2)
		);
		throw new Error();
	});
});
