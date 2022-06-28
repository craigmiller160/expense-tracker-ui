import { useQuery } from 'react-query';
import { getAuthUser } from '../service/AuthService';
import { QueryHookResult } from './index';
import { AuthUser } from '../../types/auth';

export const GET_AUTH_USER = 'AuthQueries_getAuthUser';

export interface GetAuthUserExtra {
	readonly isAuthorized: () => boolean;
	readonly hasCheckedAuthorization: () => boolean;
}

export const useGetAuthUser = (): QueryHookResult<
	AuthUser,
	GetAuthUserExtra
> => {
	const result = useQuery<AuthUser, Error>(GET_AUTH_USER, getAuthUser);
	const isAuthorized = () => result.status === 'success';
	const hasCheckedAuthorization = () =>
		!['idle', 'loading'].includes(result.status);
	return {
		result,
		extra: {
			isAuthorized,
			hasCheckedAuthorization
		}
	};
};
