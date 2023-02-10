import { useQuery } from '@tanstack/react-query';
import { getAuthUser } from '../service/AuthService';
import { QueryHookResult } from './index';
import { AuthUserDto } from '../../types/generated/expense-tracker';

export const GET_AUTH_USER = 'AuthQueries_getAuthUser';

export interface GetAuthUserExtra {
	readonly isAuthorized: boolean;
	readonly hasCheckedAuthorization: boolean;
}

export const useGetAuthUser = (): QueryHookResult<
	AuthUserDto,
	GetAuthUserExtra
> => {
	const result = useQuery<AuthUserDto, Error>(GET_AUTH_USER, getAuthUser, {
		refetchOnWindowFocus: true,
		retry: false
	});
	return {
		result,
		extra: {
			isAuthorized: result.status === 'success',
			hasCheckedAuthorization: !['idle', 'loading'].includes(
				result.status
			)
		}
	};
};
