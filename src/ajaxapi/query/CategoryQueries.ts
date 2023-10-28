import type { UseMutateFunction } from '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	createCategory,
	deleteCategory,
	getAllCategories,
	getUnknownCategory,
	updateCategory
} from '../service/CategoryService';
import type { CategoryResponse } from '../../types/generated/expense-tracker';

export const GET_ALL_CATEGORIES = 'CategoryQueries_GetAllCategories';
export const GET_UNKNOWN_CATEGORY = 'CategoryQueries_GetUnknownCategory';

export const useGetAllCategories = () =>
	useQuery<ReadonlyArray<CategoryResponse>, Error>({
		queryKey: [GET_ALL_CATEGORIES],
		queryFn: ({ signal }) => getAllCategories(signal)
	});

export const useGetUnknownCategory = () =>
	useQuery<CategoryResponse>({
		queryKey: [GET_UNKNOWN_CATEGORY],
		queryFn: ({ signal }) => getUnknownCategory(signal)
	});

interface UpdateCategoryParams {
	readonly id: string;
	readonly name: string;
}

export type UpdateCategoryMutation = UseMutateFunction<
	unknown,
	Error,
	UpdateCategoryParams
>;

export const useUpdateCategory = () => {
	const queryClient = useQueryClient();
	return useMutation<unknown, Error, UpdateCategoryParams>({
		mutationFn: ({ id, name }) => updateCategory(id, name),
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: [GET_ALL_CATEGORIES]
			})
	});
};

interface CreateCategoryParams {
	readonly name: string;
}

export type CreateCategoryMutation = UseMutateFunction<
	CategoryResponse,
	Error,
	CreateCategoryParams
>;

export const useCreateCategory = () => {
	const queryClient = useQueryClient();
	return useMutation<CategoryResponse, Error, CreateCategoryParams>({
		mutationFn: ({ name }) => createCategory(name),
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: [GET_ALL_CATEGORIES]
			})
	});
};

interface DeleteCategoryParams {
	readonly id: string;
}

export type DeleteCategoryMutation = UseMutateFunction<
	unknown,
	Error,
	DeleteCategoryParams
>;

export const useDeleteCategory = () => {
	const queryClient = useQueryClient();
	return useMutation<unknown, Error, DeleteCategoryParams>({
		mutationFn: ({ id }) => deleteCategory(id),
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: [GET_ALL_CATEGORIES]
			})
	});
};
