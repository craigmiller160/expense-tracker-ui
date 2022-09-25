import { AuthUser, AuthCodeLogin } from '../../types/auth';
import { expenseTrackerApi, getData } from './AjaxApi';
import { NoAlertOrStatusHandlingError } from '../../error/NoAlertOrStatusHandlingError';

export const getAuthUser = (): Promise<AuthUser> =>
	expenseTrackerApi
		.get<AuthUser>({
			uri: '/oauth/user',
			errorCustomizer: (error) =>
				new NoAlertOrStatusHandlingError(
					'Error getting authenticated user',
					{
						cause: error
					}
				)
		})
		.then(getData);

export const login = (): Promise<AuthCodeLogin> =>
	expenseTrackerApi
		.post<AuthCodeLogin, void>({
			uri: '/oauth/authcode/login',
			errorCustomizer: 'Error getting login URI'
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
			errorCustomizer: 'Error logging out'
		})
		.then(getData);
