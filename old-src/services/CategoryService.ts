import { CategoryResponse } from '../types/categories';
import { expenseTrackerApi, getData } from './AjaxApi';

export const getAllCategories = (): Promise<ReadonlyArray<CategoryResponse>> =>
	expenseTrackerApi
		.get<ReadonlyArray<CategoryResponse>>({
			uri: '/categories',
			errorMsg: 'Error getting all categories'
		})
		.then(getData);
