import { TextField } from '@craigmiller160/react-hook-form-material-ui';
import { useFormWithSearchParamSync } from '../../src/routes/useFormWithSearchParamSync';
import {
	SyncFromParams,
	SyncToParams
} from '../../src/routes/useSearchParamSync';
import { setOrDeleteParam } from '../../src/routes/paramUtils';
import { InitialEntry } from 'history';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useLocation } from 'react-router';

type Form = {
	readonly count: number;
	readonly name: string;
};

const formToParams: SyncToParams<Form> = (form, params) => {
	params.set('count', form.count.toString());
	const setOrDelete = setOrDeleteParam(params);
	setOrDelete('name', form.name);
};

const formFromParams: SyncFromParams<Form> = (params) => ({
	count: parseInt(params.get('count') ?? ''),
	name: params.get('name') ?? ''
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
			<p>Count: {values.count}</p>
			<p>Name: {values.name}</p>
			<p>Search: {location.search}</p>
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
		expect(screen.getByText(/Count/)).toHaveTextContent('Count: 0');
		expect(screen.getByText(/Name/)).toHaveTextContent('Name: ');
		expect(screen.getByText(/Search/)).toHaveTextContent(
			'Search: ?count=0'
		);
	});

	it('updates form and params', async () => {
		doMount('/');
		throw new Error();
	});

	it('merges initial params values with default form values', () => {
		doMount('/?name=bob');
		throw new Error();
	});
});
