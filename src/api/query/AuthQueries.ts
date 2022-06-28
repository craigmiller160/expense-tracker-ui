import { useQuery } from 'react-query';
import { getAuthUser } from '../service/AuthService';

export const GET_AUTH_USER = 'AuthQueries_getAuthUser';

export const useGetAuthUser = () => useQuery(GET_AUTH_USER, getAuthUser);
