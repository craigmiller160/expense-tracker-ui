import { createApi, DefaultErrorHandler } from '@craigmiller160/ajax-api';
import { AxiosResponse } from 'axios';
import { match } from 'ts-pattern';
import { debounce } from 'lodash-es';
import { addAlert } from '../stores/AlertStore';
import { authUserResource } from '../resources/AuthResources';

const handleUnauthorizedError = debounce(() => {
	const [, { mutate }] = authUserResource;
	mutate(undefined); // TODO need to validate that this works if unauthorized
	addAlert('error', 'Unauthorized');
}, 500);

const defaultErrorHandler: DefaultErrorHandler = (status, error, message) => {
	console.error(message, error);
	match(status)
		.with(401, handleUnauthorizedError)
		.otherwise(() =>
			addAlert('error', `${message ?? ''}: ${error.message}`)
		);
};

export const expenseTrackerApi = createApi({
	baseURL: '/expense-tracker/api',
	defaultErrorHandler
});

export const getData = <T>(res: AxiosResponse<T>) => res.data;
