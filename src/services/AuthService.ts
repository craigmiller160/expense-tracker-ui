import { expenseTrackerApi } from './AjaxApi';
import { createResource } from 'solid-js';

export const getAuthUser = () =>
	createResource(() =>
		expenseTrackerApi.get({
			uri: '/oauth/user'
		})
	);
