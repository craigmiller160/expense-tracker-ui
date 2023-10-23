import { createApi } from '@craigmiller160/ajax-api';
import type { AxiosResponse } from 'axios';

// TODO need error handler
export const expenseTrackerApi = createApi({
	baseURL: '/expense-tracker/api'
});

export const getData = <T>(res: AxiosResponse<T>): T => res.data;
