import { expenseTrackerApi, getData } from './AjaxApi';
import { AuthCodeLogin, AuthUser } from '../types/auth';
import { isAxiosError } from '@craigmiller160/ajax-api';

export const getAuthUser = (): Promise<AuthUser> =>
	expenseTrackerApi
		.get<AuthUser>({
			uri: '/oauth/user',
			errorMsg: 'Error getting authenticated user',
			suppressError: (ex: Error) => {
				if (isAxiosError(ex)) {
					return ex.response?.status === 401;
				}
				return false;
			}
		})
		.then(getData);

export const login = (): Promise<AuthCodeLogin> =>
	expenseTrackerApi
		.post<void, AuthCodeLogin>({
			uri: '/oauth/authcode/login',
			errorMsg: 'Error getting login URI'
		})
		.then(getData);

export const logout = () =>
	expenseTrackerApi
		.get<void>({
			uri: '/oauth/logout',
			errorMsg: 'Error logging out'
		})
		.then(getData);
