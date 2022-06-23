import { createApi } from '@craigmiller160/ajax-api';

export const expenseTrackerApi = createApi({
	baseURL: '/expense-tracker/api'
});

export const oauth2Api = createApi({
	baseURL: '/expense-tracker/oauth2'
});
