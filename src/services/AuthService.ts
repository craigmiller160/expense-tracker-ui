import { expenseTrackerApi, getData } from './AjaxApi';
import { createResource } from 'solid-js';
import { AuthUser } from '../types/auth';

export const getAuthUser = () =>
	createResource(() =>
		expenseTrackerApi
			.get<AuthUser>({
				uri: '/oauth/user'
			})
			.then(getData)
	);
