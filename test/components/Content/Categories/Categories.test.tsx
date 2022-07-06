import { ApiServer, newApiServer } from '../../../server';
import { renderApp } from '../../../testutils/renderApp';
import { screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { typeInInput } from '../../../testutils/testEvents';

describe('Manage Categories', () => {
	let apiServer: ApiServer;
	beforeEach(() => {
		apiServer = newApiServer();
	});

	afterEach(() => {
		apiServer.server.shutdown();
	});
	it('displays all categories on sever', async () => {
		await renderApp({
			initialPath: '/expense-tracker/categories'
		});
		await waitFor(() =>
			expect(screen.queryAllByText('Manage Categories')).toHaveLength(2)
		);
		expect(screen.queryByText('Name')).toBeVisible();
		expect(screen.queryByText('Actions')).toBeVisible();
		await waitFor(() =>
			expect(screen.queryAllByText('Details')).toHaveLength(3)
		);
		expect(screen.queryByText('Add')).toBeVisible();
		expect(screen.queryByText('Groceries')).toBeVisible();
		expect(screen.queryByText('Restaurants')).toBeVisible();
		expect(screen.queryByText('Entertainment')).toBeVisible();
	});

	it('adds new category', async () => {
		await renderApp({
			initialPath: '/expense-tracker/categories'
		});
		await waitFor(() =>
			expect(screen.queryByText('Expense Tracker')).toBeVisible()
		);
		await waitFor(() =>
			expect(screen.queryAllByText('Manage Categories')).toHaveLength(2)
		);
		await waitFor(() => expect(screen.queryByText('Add')).toBeVisible());
		userEvent.click(screen.getByText('Add'));
		await waitFor(() =>
			expect(screen.queryByText('New Category')).toBeVisible()
		);
		expect(screen.queryByDisplayValue('New Category')).toBeVisible();
		typeInInput(screen.getByTestId('name-field'), 'Abc');
		await waitFor(() =>
			expect(screen.getByDisplayValue('Abc')).toBeVisible()
		);

		userEvent.click(screen.getByText('Save'));

		await waitFor(() =>
			expect(screen.queryByText('New Category')).not.toBeInTheDocument()
		);
		await waitFor(() => expect(screen.queryByText('Abc')).toBeVisible());
		expect(screen.queryAllByText('Details')).toHaveLength(4);
	});

	it('will not save category without name', async () => {
		await renderApp({
			initialPath: '/expense-tracker/categories'
		});
		await waitFor(() =>
			expect(screen.queryByText('Expense Tracker')).toBeVisible()
		);
		await waitFor(() =>
			expect(screen.queryAllByText('Manage Categories')).toHaveLength(2)
		);
		await waitFor(() => expect(screen.queryByText('Add')).toBeVisible());
		userEvent.click(screen.getByText('Add'));
		await waitFor(() =>
			expect(screen.queryByText('New Category')).toBeVisible()
		);
		expect(screen.queryByDisplayValue('New Category')).toBeVisible();
		typeInInput(screen.getByTestId('name-field'), '');
		await waitFor(() =>
			expect(
				screen.queryByDisplayValue('New Category')
			).not.toBeInTheDocument()
		);

		userEvent.click(screen.getByText('Save'));
		await waitFor(() =>
			expect(screen.queryByText('Must provide a name')).toBeVisible()
		);
	});

	it('updates category name', async () => {
		await renderApp({
			initialPath: '/expense-tracker/categories'
		});
		await waitFor(() =>
			expect(screen.queryByText('Expense Tracker')).toBeVisible()
		);
		await waitFor(() =>
			expect(screen.queryAllByText('Manage Categories')).toHaveLength(2)
		);
		await waitFor(() =>
			expect(screen.queryAllByText('Details')).toHaveLength(3)
		);
		const firstDetailsButton = screen.getAllByText('Details')[0];
		userEvent.click(firstDetailsButton);

		await waitFor(() =>
			expect(screen.queryByText('Category: Entertainment')).toBeVisible()
		);
		typeInInput(screen.getByTestId('name-field'), 'Abc');

		userEvent.click(screen.getByText('Save'));
		await waitFor(() =>
			expect(
				screen.queryByText('Category: Entertainment')
			).not.toBeInTheDocument()
		);
		await waitFor(() => expect(screen.queryByText('Abc')).toBeVisible());
		expect(screen.queryByText('Entertainment')).not.toBeInTheDocument();
		expect(screen.queryAllByText('Details')).toHaveLength(3);
	});

	it('deletes category', async () => {
		await renderApp({
			initialPath: '/expense-tracker/categories'
		});
		await waitFor(() =>
			expect(screen.queryByText('Expense Tracker')).toBeVisible()
		);
		await waitFor(() =>
			expect(screen.queryAllByText('Manage Categories')).toHaveLength(2)
		);
		await waitFor(() =>
			expect(screen.queryAllByText('Details')).toHaveLength(3)
		);
		const firstDetailsButton = screen.getAllByText('Details')[0];
		userEvent.click(firstDetailsButton);

		await waitFor(() =>
			expect(screen.queryByText('Category: Entertainment')).toBeVisible()
		);
		userEvent.click(screen.getByText('Delete'));
		await waitFor(() =>
			expect(screen.queryByText('Confirm')).toBeVisible()
		);
		expect(
			screen.queryByText('Are you sure you want to delete this Category?')
		).toBeVisible();
		userEvent.click(screen.getByText('Confirm'));

		await waitFor(() =>
			expect(
				screen.queryByText('Category: Entertainment')
			).not.toBeInTheDocument()
		);
		await waitFor(() =>
			expect(screen.queryAllByText('Details')).toHaveLength(2)
		);
		expect(screen.queryByText('Entertainment')).not.toBeInTheDocument();
	});
});
