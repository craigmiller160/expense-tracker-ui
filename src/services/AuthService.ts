import { expenseTrackerApi, getData } from './AjaxApi';
import { AuthUser } from '../types/auth';

export const getAuthUser = (): Promise<AuthUser> =>
	expenseTrackerApi
		.get<AuthUser>({
			uri: '/oauth/user'
		})
		.then(getData);
