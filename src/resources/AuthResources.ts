import { createResource } from 'solid-js';
import { getAuthUser } from '../services/AuthService';
import { AuthUser } from '../types/auth';
import { DefaultResourceReturn } from './types';

export const authUserResource: DefaultResourceReturn<AuthUser> =
	createResource(getAuthUser);

export const isAuthenticated = (): boolean => {
	const [data] = authUserResource;
	return !data.loading && !data.error;
};
