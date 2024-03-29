import { describe, it, expect } from 'vitest';
import { TextField } from '@craigmiller160/react-hook-form-material-ui';
import { useFormWithSearchParamSync } from '../../src/routes/useFormWithSearchParamSync';
import type {
	SyncFromParams,
	SyncToParams
} from '../../src/routes/useSearchParamSync';
import type { InitialEntry } from 'history';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useLocation } from 'react-router';
import userEvents from '@testing-library/user-event';

type Form = {
	readonly count: number;
	readonly name: string;
};

const formToParams: SyncToParams<Form> = (form, params) => {
	params.setOrDelete('count', form.count.toString());
	params.setOrDelete('name', form.name);
};

const formFromParams: SyncFromParams<Form> = (params) => ({
	count: params.getOrDefault('count', 0, parseInt),
	name: params.getOrDefault('name', '')
});

const TestComponent = () => {
	const location = useLocation();
	const { control, getValues } = useFormWithSearchParamSync<Form>({
		formToParams,
		formFromParams,
		defaultValues: {
			count: 0
		}
	});
	const values = getValues();

	return (
		<div>
			<form>
				<TextField
					control={control}
					name="count"
					label="Count"
					type="number"
				/>
				<TextField control={control} name="name" label="Name" />
			</form>
			<p>Count Value: {values.count}</p>
			<p>Name Value: {values.name}</p>
			<p>Search Value: {location.search}</p>
		</div>
	);
};

const doMount = (initialEntry: InitialEntry) =>
	render(
		<MemoryRouter initialEntries={[initialEntry]}>
			<TestComponent />
		</MemoryRouter>
	);

describe('useFormWithSearchParamSync', () => {
	it('sets form default values in params', () => {
		doMount('/');
		expect(screen.getByText(/Count Value/)).toHaveTextContent(
			'Count Value: 0'
		);
		expect(screen.getByText(/Name Value/)).toHaveTextContent('Name Value:');
		expect(screen.getByText(/Search Value/)).toHaveTextContent(
			'Search Value: ?count=0'
		);
	});

	it('updates form and params', async () => {
		doMount('/');
		await userEvents.type(screen.getByLabelText('Count'), '1');
		await waitFor(() =>
			expect(screen.getByText(/Count Value/)).toHaveTextContent(
				'Count Value: 1'
			)
		);
		expect(screen.getByText(/Name Value/)).toHaveTextContent('Name Value:');
		expect(screen.getByText(/Search Value/)).toHaveTextContent(
			'Search Value: ?count=1'
		);
	});

	it('merges initial params values with default form values', async () => {
		doMount('/?name=bob');
		expect(screen.getByText(/Count Value/)).toHaveTextContent(
			'Count Value: 0'
		);
		expect(screen.getByText(/Name Value/)).toHaveTextContent(
			'Name Value: bob'
		);
		await waitFor(() =>
			expect(screen.getByText(/Search Value/)).toHaveTextContent(
				'Search Value: ?count=0&name=bob'
			)
		);
	});
});
