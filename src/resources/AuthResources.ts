import { createResource } from 'solid-js';
import { getAuthUser } from '../services/AuthService';
import { AuthUser } from '../types/auth';
import { DefaultResourceReturn } from './types';
import axios from 'axios';
import { getData } from '../services/AjaxApi';

export const authUserResource: DefaultResourceReturn<AuthUser> = createResource(
	() => axios.get<AuthUser>('/expense-tracker/api/oauth/user').then(getData)
);

export const hasCheckedAuthStatus = (): boolean => {
	const [data] = authUserResource;
	return !data.loading && (!!data() || !!data.error);
};

export const isAuthenticated = (): boolean => {
	const [data] = authUserResource;
	return !data.loading && !data.error;
};
