import { createResource } from 'solid-js';
import { getAuthUser } from '../services/AuthService';
import { AuthUser } from '../types/auth';
import { DefaultResourceReturn } from './types';

export const authUserResource: DefaultResourceReturn<AuthUser> =
	createResource(getAuthUser);

export const hasCheckedAuthStatus = (): boolean => {
	const [data] = authUserResource;
	console.log('InnerCheck', data.loading, data(), data.error);
	return !data.loading && (!!data() || !!data.error);
};

export const isAuthenticated = (): boolean => {
	const [data] = authUserResource;
	return !data.loading && !data.error;
};
