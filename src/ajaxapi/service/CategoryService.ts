import { CategoryRequest, CategoryResponse } from '../../types/categories';
import { expenseTrackerApi, getData } from './AjaxApi';

export const getAllCategories = (): Promise<ReadonlyArray<CategoryResponse>> =>
	expenseTrackerApi
		.get<ReadonlyArray<CategoryResponse>>({
			uri: '/categories',
			errorMsg: 'Error getting all categories'
		})
		.then(getData)
		.catch((ex) =>
			Promise.reject(
				new Error('Error getting all categories', {
					cause: ex
				})
			)
		);

export const updateCategory = (id: string, name: string): Promise<unknown> =>
	expenseTrackerApi.put<CategoryRequest, unknown>({
		uri: `/categories/${id}`,
		errorMsg: `Error updating category ${id}`,
		body: {
			name
		}
	});
