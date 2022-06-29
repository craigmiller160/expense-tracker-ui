import { AuthUser, AuthCodeLogin } from '../../types/auth';
import { expenseTrackerApi, getData } from './AjaxApi';
import { NoAlertOrStatusHandlingError } from '../../error/NoAlertOrStatusHandlingError';

// TODO remove the use of my ajax lib
export const getAuthUser = (): Promise<AuthUser> =>
	expenseTrackerApi
		.get<AuthUser>({
			uri: '/oauth/user',
			errorMsg: 'Error getting authenticated user'
		})
		.then(getData)
		.catch((ex) =>
			Promise.reject(
				new NoAlertOrStatusHandlingError(
					'Error getting authenticated user',
					{
						cause: ex
					}
				)
			)
		);

export const login = (): Promise<AuthCodeLogin> =>
	expenseTrackerApi
		.post<void, AuthCodeLogin>({
			uri: '/oauth/authcode/login',
			errorMsg: 'Error getting login URI'
		})
		.then(getData)
		.then((data) => {
			window.location.assign(data.url);
			return data;
		});

export const logout = () =>
	expenseTrackerApi
		.get<void>({
			uri: '/oauth/logout',
			errorMsg: 'Error logging out'
		})
		.then(getData);
