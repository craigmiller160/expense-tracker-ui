import { AuthUser } from '../../types/auth';
import { expenseTrackerApi, getData } from './AjaxApi';

// TODO look into suppressing the error
export const getAuthUser = (): Promise<AuthUser> =>
	expenseTrackerApi
		.get<AuthUser>({
			uri: '/oauth/user',
			errorMsg: 'Error getting authenticated user'
		})
		.then(getData);
