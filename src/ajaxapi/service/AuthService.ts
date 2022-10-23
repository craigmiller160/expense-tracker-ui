import {
	AuthCodeLoginDto,
	AuthUserDto
} from '../../types/generated/expense-tracker';
import { expenseTrackerApi, getData } from './AjaxApi';
import { NoAlertOrStatusHandlingError } from '../../error/NoAlertOrStatusHandlingError';

export const getAuthUser = (): Promise<AuthUserDto> =>
	expenseTrackerApi
		.get<AuthUserDto>({
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

export const login = (): Promise<AuthCodeLoginDto> =>
	expenseTrackerApi
		.post<AuthCodeLoginDto, void>({
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
