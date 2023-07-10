import {
	CategoryResponse,
	CategoryRequest
} from '../../types/generated/expense-tracker';
import { expenseTrackerApi, getData } from './AjaxApi';

export const getAllCategories = (
	signal?: AbortSignal
): Promise<ReadonlyArray<CategoryResponse>> =>
	expenseTrackerApi
		.get<ReadonlyArray<CategoryResponse>>({
			uri: '/categories',
			errorCustomizer: 'Error getting all categories',
			config: {
				signal
			}
		})
		.then(getData);

export const updateCategory = (id: string, name: string): Promise<unknown> =>
	expenseTrackerApi.put<unknown, CategoryRequest>({
		uri: `/categories/${id}`,
		errorCustomizer: `Error updating category ${id}`,
		body: {
			name
		}
	});

export const getUnknownCategory = (
	signal?: AbortSignal
): Promise<CategoryResponse> =>
	expenseTrackerApi
		.get<CategoryResponse>({
			uri: '/categories/unknown',
			errorCustomizer: 'Error getting unknown category',
			config: {
				signal
			}
		})
		.then(getData);

export const createCategory = (name: string): Promise<CategoryResponse> =>
	expenseTrackerApi
		.post<CategoryResponse, CategoryRequest>({
			uri: '/categories',
			errorCustomizer: 'Error adding category',
			body: {
				name
			}
		})
		.then(getData);

export const deleteCategory = (id: string): Promise<unknown> =>
	expenseTrackerApi.delete<unknown>({
		uri: `/categories/${id}`,
		errorCustomizer: `Error deleting category ${id}`
	});
